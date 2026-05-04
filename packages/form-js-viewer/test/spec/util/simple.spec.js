import { pruneAt } from '../../../src/util';

describe('util/simple', function () {
  describe('pruneAt', function () {
    it('should delete a top-level key', function () {
      const result = pruneAt({ a: 1, b: 2 }, ['a']);
      expect(result).to.eql({ b: 2 });
    });

    it('should delete a nested key', function () {
      const result = pruneAt({ a: { b: 1 } }, ['a', 'b']);
      expect(result).to.eql({});
    });

    it('should delete an array entry without compacting', function () {
      const result = pruneAt({ a: [1, 2, 3] }, ['a', 1]);
      expect(result.a[1]).to.not.exist;
      expect(result.a[2]).to.equal(3);
    });

    it('should prune empty ancestor objects', function () {
      const result = pruneAt({ a: { b: { c: 1 } } }, ['a', 'b', 'c']);
      expect(result).to.eql({});
    });

    it('should prune empty ancestor arrays', function () {
      const result = pruneAt({ a: [[1]] }, ['a', 0, 0]);
      expect(result).to.eql({});
    });

    it('should not prune ancestors that still have entries', function () {
      const result = pruneAt({ a: [1, 2] }, ['a', 0]);
      expect(result).to.have.nested.property('a');
    });

    it('should treat nullish array entries as absent when pruning', function () {
      const result = pruneAt({ a: [null, ['error']] }, ['a', 1]);
      expect(result).to.eql({});
    });

    it('should do nothing if path does not exist', function () {
      const result = pruneAt({ a: 1 }, ['b', 'c']);
      expect(result).to.eql({ a: 1 });
    });

    it('should do nothing for an empty path', function () {
      const result = pruneAt({ a: 1 }, []);
      expect(result).to.eql({ a: 1 });
    });

    it('should not mutate the input', function () {
      const target = { a: { b: 1, c: 2 } };
      const result = pruneAt(target, ['a', 'b']);
      expect(target).to.eql({ a: { b: 1, c: 2 } });
      expect(result).to.eql({ a: { c: 2 } });
      expect(result).to.not.equal(target);
      expect(result.a).to.not.equal(target.a);
    });

    it('should keep references to untouched sibling branches', function () {
      const sibling = { x: 1 };
      const target = { a: { b: 1 }, c: sibling };
      const result = pruneAt(target, ['a', 'b']);
      expect(result.c).to.equal(sibling);
    });
  });
});
