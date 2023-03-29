import {
  formatTime,
  parseInputTime,
  serializeTime,
  parseIsoTime,
  serializeDate,
  isDateTimeInputInformationSufficient,
  serializeDateTime,
  formatTimezoneOffset,
  isInvalidDateString
} from '../../../../../src/render/components/util/dateTimeUtil.js';


describe('DateTimeUtil', function() {

  describe('#formatTime', function() {

    it('should format to AM/PM format', () => {

      // given
      const use24h = false;
      const testCases = [
        [ 0, '12:00 AM' ],
        [ 1, '12:01 AM' ],
        [ 720, '12:00 PM' ],
        [ 1440, '12:00 AM' ],
        [ 1441, '12:01 AM' ],
        [ 600, '10:00 AM' ],
        [ 1200, '08:00 PM' ],
        [ 111, '01:51 AM' ]
      ];

      // then
      for (const [ minutes, expected ] of testCases) {
        expect(formatTime(use24h, minutes)).to.equal(expected);
      }
    });


    it('should format to 24h format', () => {

      // given
      const use24h = true;
      const testCases = [
        [ 0, '00:00' ],
        [ 1, '00:01' ],
        [ 720, '12:00' ],
        [ 1440, '00:00' ],
        [ 1441, '00:01' ],
        [ 600, '10:00' ],
        [ 1200, '20:00' ],
        [ 111, '01:51' ]
      ];

      // then
      for (const [ minutes, expected ] of testCases) {
        expect(formatTime(use24h, minutes)).to.equal(expected);
      }
    });

  });


  describe('#parseInputTime', function() {

    it('should parse AM/PM formats', () => {

      // given
      const testCases = [
        [ '12:00 AM', 0 ],
        [ '12:01 AM', 1 ],
        [ '12:00 PM', 720 ],
        [ '10:00 AM', 600 ],
        [ '08:00 PM', 1200 ],
        [ '01:51 AM', 111 ],
        [ '01:51am', 111 ],
        [ 'asdsacsasc', null ],
        [ '46:12 pm', null ],
      ];

      // then
      for (const [ inputTime, expected ] of testCases) {
        expect(parseInputTime(inputTime)).to.equal(expected);
      }
    });


    it('should parse 24h formats', () => {

      // given
      const testCases = [
        [ '24:00', null ],
        [ '23:59', 1439 ],
        [ '12:00', 720 ],
        [ '10:00', 600 ],
        [ '20:00', 1200 ],
        [ '01:51', 111 ],
        [ '01:51  ', 111 ],
        [ 'asdsacsasc', null ],
        [ '46:12', null ],
      ];

      // then
      for (const [ inputTime, expected ] of testCases) {
        expect(parseInputTime(inputTime)).to.equal(expected);
      }
    });

  });


  describe('#serializeTime', function() {

    it('should serialize with full timezone', () => {

      // given
      const serializingFormat = 'utc_offset';
      const testCases = [
        [ 0, 0, '00:00+00:00' ],
        [ 0, -1, '00:00+00:01' ],
        [ 0, 1, '00:00-00:01' ],
        [ 0, 120, '00:00-02:00' ],
        [ 1, 0, '00:01+00:00' ],
        [ 1, 180, '00:01-03:00' ],
        [ 720, 123, '12:00-02:03' ],
        [ 720, -123, '12:00+02:03' ],
      ];

      // then
      for (const [ minutes, offset, expected ] of testCases) {
        expect(serializeTime(minutes, offset, serializingFormat)).to.equal(expected);
      }
    });


    it('should serialize with normalized timezone', () => {

      // given
      const serializingFormat = 'utc_normalized';
      const testCases = [
        [ 0, 0, '00:00Z' ],
        [ 0, 120, '02:00Z' ],
        [ 1, 0, '00:01Z' ],
        [ 1, 180, '03:01Z' ],
        [ 720, 123, '14:03Z' ],
        [ 1400, 40, '00:00Z' ],
        [ 1400, 160, '02:00Z' ],
      ];

      // then
      for (const [ minutes, offset, expected ] of testCases) {
        expect(serializeTime(minutes, offset, serializingFormat)).to.equal(expected);
      }
    });


    it('should serialize without timezone', () => {

      // given
      const serializingFormat = 'no_timezone';
      const testCases = [
        [ 0, 0, '00:00' ],
        [ 0, 120, '00:00' ],
        [ 1, 0, '00:01' ],
        [ 1, 180, '00:01' ],
        [ 720, 123, '12:00' ],
      ];

      // then
      for (const [ minutes, offset, expected ] of testCases) {
        expect(serializeTime(minutes, offset, serializingFormat)).to.equal(expected);
      }
    });

  });


  describe('#parseIsoTime', function() {

    it('should parse full timezones', () => {

      // given
      const localOffset = new Date().getTimezoneOffset();
      const testCases = [
        [ '00:00+00:00', 0 ],
        [ '00:00+00:01', 1439 ],
        [ '00:00-00:01', 1 ],
        [ '00:00-02:00', 120 ],
        [ '00:01+00:00', 1 ],
        [ '00:01-03:00', 181 ],
        [ '12:00+02:03', 597 ],
        [ '12:00-02:03', 843 ],
        [ '22:00-02:00', 0 ],
      ];

      // then
      for (const [ isoTime, expectedWithoutOffset ] of testCases) {
        const expected = (expectedWithoutOffset + 1440 - localOffset) % 1440;
        expect(parseIsoTime(isoTime)).to.equal(expected);
      }
    });


    it('should parse normalized timezones', () => {

      // given
      const localOffset = new Date().getTimezoneOffset();
      const testCases = [
        [ '00:00Z', 0 ],
        [ '00:30Z', 30 ],
        [ '20:00Z', 1200 ],
        [ '23:59Z', 1439 ]
      ];

      // then
      for (const [ isoTime, expectedWithoutOffset ] of testCases) {
        const expected = (expectedWithoutOffset + 1440 - localOffset) % 1440;
        expect(parseIsoTime(isoTime)).to.equal(expected);
      }
    });


    it('should parse local times', () => {

      // given
      const testCases = [
        [ '00:00', 0 ],
        [ '00:30', 30 ],
        [ '20:00', 1200 ],
        [ '23:59', 1439 ]
      ];

      // then
      for (const [ isoTime, expected ] of testCases) {
        expect(parseIsoTime(isoTime)).to.equal(expected);
      }
    });

  });


  describe('#serializeDate', function() {

    it('should serialize date to iso format', () => {

      // given
      const testCases = [
        [ new Date(2005, 3, 7), '2005-04-07' ],
        [ new Date(2000, 0, 1), '2000-01-01' ],
        [ new Date(4000, 11, 15), '4000-12-15' ],
      ];

      // then
      for (const [ date, expected ] of testCases) {
        expect(serializeDate(date)).to.equal(expected);
      }

    });

  });


  describe('#isDateTimeInputInformationSufficient', function() {

    it('should reject partially defined dateTime', () => {

      // given
      const invalidTestCases = [ '2005', '2005-04', '2005-04-07' ];

      // then
      for (const invalidDateTime of invalidTestCases) {
        expect(isDateTimeInputInformationSufficient(invalidDateTime)).to.be.false;
      }

    });


    it('should accept fully defined dateTime', () => {

      // given
      const validTestCases = [ '2005-04-07T02:01', '2005-04-07T02:01:15', '2005-04-07T02:01:15.1000' ];

      // then
      for (const validDateTime of validTestCases) {
        expect(isDateTimeInputInformationSufficient(validDateTime)).to.be.true;
      }

    });

  });


  describe('#serializeDateTime', function() {

    it('should serialize with full timezone', () => {

      // given
      const getTimezoneOffsetSuffix = (date) => formatTimezoneOffset(date.getTimezoneOffset());
      const serializingFormat = 'utc_offset';
      const testCases = [
        [ new Date('1995-11-15'), 0, '1995-11-15T00:00' ],
        [ new Date('2000-01-01'), 0, '2000-01-01T00:00' ],
        [ new Date('1995-11-15'), 1, '1995-11-15T00:01' ],
        [ new Date('2000-01-01'), 1, '2000-01-01T00:01' ],
        [ new Date('1995-11-15'), 720, '1995-11-15T12:00' ],
        [ new Date('2000-01-01'), 720, '2000-01-01T12:00' ],
      ];

      // then
      for (const [ date, minutes, expectedWithoutSuffix ] of testCases) {
        const expected = expectedWithoutSuffix + getTimezoneOffsetSuffix(date);
        expect(serializeDateTime(date, minutes, serializingFormat)).to.equal(expected);
      }
    });


    it('should serialize with normalized timezone', () => {

      // given
      const serializingFormat = 'utc_normalized';
      const testCases = [
        [ new Date('1995-11-15'), 0, '1995-11-15T00:00Z' ],
        [ new Date('2000-01-01'), 0, '2000-01-01T00:00Z' ],
        [ new Date('1995-11-15'), 1, '1995-11-15T00:01Z' ],
        [ new Date('2000-01-01'), 1, '2000-01-01T00:01Z' ],
        [ new Date('1995-11-15'), 720, '1995-11-15T12:00Z' ],
        [ new Date('2000-01-01'), 720, '2000-01-01T12:00Z' ],
      ];

      // then
      for (const [ date, minutesWithoutOffset, expected ] of testCases) {
        const minutes = minutesWithoutOffset - date.getTimezoneOffset();
        expect(serializeDateTime(date, minutes, serializingFormat)).to.equal(expected);
      }
    });


    it('should serialize without timezone', () => {

      // given
      const serializingFormat = 'no_timezone';
      const testCases = [
        [ new Date('1995-11-15'), 0, '1995-11-15T00:00' ],
        [ new Date('2000-01-01'), 0, '2000-01-01T00:00' ],
        [ new Date('1995-11-15'), 1, '1995-11-15T00:01' ],
        [ new Date('2000-01-01'), 1, '2000-01-01T00:01' ],
        [ new Date('1995-11-15'), 720, '1995-11-15T12:00' ],
        [ new Date('2000-01-01'), 720, '2000-01-01T12:00' ],
      ];

      // then
      for (const [ date, minutes, expected ] of testCases) {
        expect(serializeDateTime(date, minutes, serializingFormat)).to.equal(expected);
      }
    });

  });


  describe('#formatTimezoneOffset', function() {

    it('should format offsets', () => {

      // given
      const testCases = [
        [ 0, '+00:00' ],
        [ 90, '-01:30' ],
        [ 95, '-01:35' ],
        [ 660, '-11:00' ],
        [ -90, '+01:30' ],
        [ -95, '+01:35' ],
        [ -660, '+11:00' ],
      ];

      // then
      for (const [ minutes, expected ] of testCases) {
        expect(formatTimezoneOffset(minutes)).to.equal(expected);
      }

    });

  });


  describe('#isInvalidDateString', function() {

    it('should return false for valid dates', () => {

      // given
      const validDates = [ '1996-12-01', '2000-01-15', '1133-11-30' ];

      // then
      for (const date of validDates) {
        expect(isInvalidDateString(date)).to.be.false;
      }

    });


    it('should return true for invalid dates', () => {

      // given
      const invalidDates = [ 'qwertyuiop', '2000-031-152', '11-320' ];

      // then
      for (const date of invalidDates) {
        expect(isInvalidDateString(date)).to.be.true;
      }

    });

  });

});