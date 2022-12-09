import { sanitizeDateTimePickerValue } from '../../../../../../src/render/components/util/sanitizerUtil.js';

describe('sanitizerUtil', function() {

  it('#sanitizeDateTimePickerValue', function() {

    // given
    const date = { subtype: 'date' };
    const time = { subtype: 'time' };
    const datetime = { subtype: 'datetime' };

    const testcases = [

      [ date, {}, null ],
      [ date, '11:20', null ],
      [ date, '2000', null ],
      [ date, '2000-12', null ],
      [ date, '2000-12-15', '2000-12-15' ],
      [ date, '2000-12-15T11:20', null ],

      [ time, {}, null ],
      [ time, '11:20', '11:20' ],
      [ time, '2000', null ],
      [ time, '2000-12', null ],
      [ time, '2000-12-15', null ],
      [ time, '2000-12-15T11:20', null ],

      [ datetime, {}, null ],
      [ datetime, '11:20', null ],
      [ datetime, '2000', null ],
      [ datetime, '2000-12', null ],
      [ datetime, '2000-12-15', null ],
      [ datetime, '2000-12-15T11:20', '2000-12-15T11:20' ],

    ];

    // then
    for (const [ formField, value, result ] of testcases) {
      expect(sanitizeDateTimePickerValue({ formField, value })).to.equal(result);
    }

  });
});