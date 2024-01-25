import { sanitizeDateTimePickerValue, sanitizeImageSource, escapeHTML } from '../../../../../../src/render/components/util/sanitizerUtil.js';

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


  describe('#sanitizeImageSource', function() {

    it('should sanitize image source', function() {

      // given
      const src = 'javascript:alert(\'foo\')';

      // when
      const sanitized = sanitizeImageSource(src);

      // then
      expect(sanitized).to.equal('');
    });

  });


  describe('#escapeHTML', function() {

    it('should escape HTML', function() {

      // given
      const html = '<b>foo</b>';

      // when
      const escaped = escapeHTML(html);

      // then
      expect(escaped).to.equal('&lt;b&gt;foo&lt;/b&gt;');
    });


    it('should escape HTML injection', function() {

      // given
      const html = '<img src=x onerror=alert(1)//>';

      // when
      const escaped = escapeHTML(html);

      // then
      expect(escaped).to.equal('&lt;img src=x onerror=alert(1)//&gt;');
    });


    it('should escape CSS special characters ({};:)', function() {

      // given
      const html = '} * { display: none;';

      // when
      const escaped = escapeHTML(html);

      // then
      expect(escaped).to.equal('&#125; * &#123; display&#58; none&#59;');
    });

  });

});