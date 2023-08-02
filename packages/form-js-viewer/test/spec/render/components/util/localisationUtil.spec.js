import {
  getLocaleDateFormat,
  getLocaleReadableDateFormat,
  getLocaleDateFlatpickrConfig
} from '../../../../../src/render/components/util/localisationUtil.js';


describe('localisationUtil', function() {

  describe('#getLocaleDateFormat', function() {

    it('should return the correct date format for a given locale', function() {

      // given
      const locale = 'de-DE';

      // when
      const dateFormat = getLocaleDateFormat(locale);

      // then
      expect(dateFormat).to.equal('d.M.yyyy');
    });


    it('should return the default date format for an unknown locale', function() {

      // given
      const locale = 'unknown';

      // when
      const dateFormat = getLocaleDateFormat(locale);

      // then
      expect(dateFormat).to.equal('M/d/yyyy');
    });


    it('should return a resonable format the country is missing', function() {

      // given
      const locale = 'de';

      // when
      const dateFormat = getLocaleDateFormat(locale);

      // then
      expect(dateFormat).to.equal('d.M.yyyy');
    });

  });


  describe('#getLocaleDateFlatpickrConfig', function() {

    it('should return the correct date format for a given locale', function() {

      // given
      const locale = 'de-DE';

      // when
      const dateFormat = getLocaleDateFlatpickrConfig(locale);

      // then
      expect(dateFormat).to.equal('j.n.Y');
    });


    it('should return the default date format for an unknown locale', function() {

      // given
      const locale = 'unknown';

      // when
      const dateFormat = getLocaleDateFlatpickrConfig(locale);

      // then
      expect(dateFormat).to.equal('n/j/Y');
    });


    it('should return a resonable format the country is missing', function() {

      // given
      const locale = 'de';

      // when
      const dateFormat = getLocaleDateFlatpickrConfig(locale);

      // then
      expect(dateFormat).to.equal('j.n.Y');
    });

  });


  describe('#getLocaleReadableDateFormat', function() {

    it('should return the correct date format for a given locale', function() {

      // given
      const locale = 'de-DE';

      // when
      const dateFormat = getLocaleReadableDateFormat(locale);

      // then
      expect(dateFormat).to.equal('dd.mm.yyyy');
    });


    it('should always return two digits for day and month', function() {

      // given
      const locale = 'am-et';

      // when
      const dateFormat = getLocaleReadableDateFormat(locale);

      // then
      expect(dateFormat).to.equal('dd/mm/yyyy');
    });


    it('should return the default date format for an unknown locale', function() {

      // given
      const locale = 'unknown';

      // when
      const dateFormat = getLocaleReadableDateFormat(locale);

      // then
      expect(dateFormat).to.equal('mm/dd/yyyy');
    });


    it('should return a resonable format the country is missing', function() {

      // given
      const locale = 'de';

      // when
      const dateFormat = getLocaleReadableDateFormat(locale);

      // then
      expect(dateFormat).to.equal('dd.mm.yyyy');
    });

  });

});
