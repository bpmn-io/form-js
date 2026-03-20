import { deleteAt } from '../../../src/util';

describe('util/simple', function () {
  describe('deleteAt', function () {
    it('should delete a top-level key', function () {
      const target = { a: 1, b: 2 };
      deleteAt(target, ['a']);
      expect(target).to.eql({ b: 2 });
    });

    it('should delete a nested key', function () {
      const target = { a: { b: 1 } };
      deleteAt(target, ['a', 'b']);
      expect(target).to.eql({});
    });

    it('should delete an array entry', function () {
      const target = { a: [1, 2, 3] };
      deleteAt(target, ['a', 1]);
      expect(target.a[1]).to.not.exist;
    });

    it('should prune empty ancestor objects', function () {
      const target = { a: { b: { c: 1 } } };
      deleteAt(target, ['a', 'b', 'c']);
      expect(target).to.eql({});
    });

    it('should prune empty ancestor arrays', function () {
      const target = { a: [[1]] };
      deleteAt(target, ['a', 0, 0]);
      expect(target).to.eql({});
    });

    it('should not prune ancestors that still have entries', function () {
      const target = { a: [1, 2] };
      deleteAt(target, ['a', 0]);
      expect(target).to.have.nested.property('a');
    });

    it('should prune ancestors where remaining entries are null (post-clone artifacts)', function () {
      const target = { a: [null, ['error']] };
      deleteAt(target, ['a', 1]);
      expect(target).to.eql({});
    });

    it('should do nothing if path does not exist', function () {
      const target = { a: 1 };
      deleteAt(target, ['b', 'c']);
      expect(target).to.eql({ a: 1 });
    });

    it('should do nothing for an empty path', function () {
      const target = { a: 1 };
      deleteAt(target, []);
      expect(target).to.eql({ a: 1 });
    });
  });
});
