import { normalizeOptionsData } from '../../../../../../src/render/components/util/optionsUtil.js';

describe('optionsUtil', function() {

  describe('#normalizeOptionsData', function() {

    it('should not alter fully defined value', function() {

      // given
      const options = [ { value: 'john', label: 'John' }, { value: 'jessica', label: 'Jessica' } ];

      // when
      const result = normalizeOptionsData(options);

      // then
      expect(result).to.eql([ { value: 'john', label: 'John' }, { value: 'jessica', label: 'Jessica' } ]);
    });


    it('should filter out null', function() {

      // given
      const options = [ { value: 'john', label: 'John' }, { value: 'jessica', label: 'Jessica' }, null ];

      // when
      const result = normalizeOptionsData(options);

      // then
      expect(result).to.eql([ { value: 'john', label: 'John' }, { value: 'jessica', label: 'Jessica' } ]);
    });


    it('should filter out undefined', function() {

      // given
      const options = [ { value: 'john', label: 'John' }, { value: 'jessica', label: 'Jessica' }, undefined ];

      // when
      const result = normalizeOptionsData(options);

      // then
      expect(result).to.eql([ { value: 'john', label: 'John' }, { value: 'jessica', label: 'Jessica' } ]);
    });


    it('should add label if not provided', function() {

      // given
      const options = [ { value: 'john' }, { value: 'jessica' } ];

      // when
      const result = normalizeOptionsData(options);

      // then
      expect(result).to.eql([ { value: 'john', label: 'john' }, { value: 'jessica', label: 'jessica' } ]);
    });


    it('should ignore optionsData without value', function() {

      // given
      const optionsData = [ { label: 'John' }, { label: 'Jessica' } ];

      // when
      const result = normalizeOptionsData(optionsData);

      // then
      expect(result).to.eql([]);
    });


    it('should convert string definitions to value/label objects', function() {

      // given
      const optionsData = [ 'john', 'jessica' ];

      // when
      const result = normalizeOptionsData(optionsData);

      // then
      expect(result).to.eql([ { value: 'john', label: 'john' }, { value: 'jessica', label: 'jessica' } ]);
    });


    it('should filter out incorrectly structured objects', function() {

      // given
      const optionsData = [ { foo: 'bar' }, { value: 'john', label: 'John' } ];

      // when
      const result = normalizeOptionsData(optionsData);

      // then
      expect(result).to.eql([ { value: 'john', label: 'John' } ]);

    });


    it('should allow any structured objects as options if a proper label is defined', function() {

      // given
      const optionsData = [ { value: { foo: 'bar', bar: 'foo' }, label: 'myObject' }, { value: 'john', label: 'John' } ];

      // when
      const result = normalizeOptionsData(optionsData);

      // then
      expect(result).to.eql([ { value: { foo: 'bar', bar: 'foo' }, label: 'myObject' }, { value: 'john', label: 'John' } ]);

    });


    it('should filter out any structured objects as options if no label is defined', function() {

      // given
      const optionsData = [ { value: { foo: 'bar', bar: 'foo' } }, { value: 'john', label: 'John' } ];

      // when
      const result = normalizeOptionsData(optionsData);

      // then
      expect(result).to.eql([ { value: 'john', label: 'John' } ]);

    });


    it('should convert number definitions to value/label objects', function() {

      // given
      const optionsData = [ 1, 2 ];

      // when
      const result = normalizeOptionsData(optionsData);

      // then
      expect(result).to.eql([ { value: 1, label: '1' }, { value: 2, label: '2' } ]);
    });


    it('should handle zero as value', function() {

      // given
      const optionsData = [ 0 ];

      // when
      const result = normalizeOptionsData(optionsData);

      // then
      expect(result).to.eql([ { value: 0, label: '0' } ]);
    });


    it('should ignore boolean definitions', function() {

      // given
      const optionsData = [ true, false ];

      // when
      const result = normalizeOptionsData(optionsData);

      // then
      expect(result).to.eql([ { value: true, label: 'true' }, { value: false, label: 'false' } ]);
    });


    it('should handle mixed definitions individually', function() {

      // given
      const optionsData = [ { value: 'john', label: 'John' }, 'jessica', 1, true, false, null, undefined ];

      // when
      const result = normalizeOptionsData(optionsData);

      // then
      expect(result).to.eql([ { value: 'john', label: 'John' }, { value: 'jessica', label: 'jessica' }, { value: 1, label: '1' }, { value: true, label: 'true' }, { value: false, label: 'false' } ]);
    });

  });

});