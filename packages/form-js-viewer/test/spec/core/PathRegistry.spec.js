import {
  bootstrapForm,
  getForm,
  inject
} from 'test/TestHelper';

describe('PathRegistry', function() {

  let localPathRegistry,
      localFormFieldRegistry;

  beforeEach(bootstrapForm());

  beforeEach(inject(function(pathRegistry, formFieldRegistry) {
    localPathRegistry = pathRegistry;
    localFormFieldRegistry = formFieldRegistry;
  }));

  afterEach(function() {
    getForm().destroy();
  });

  describe('#canClaimPath', function() {

    it('should claim path when available', function() {

      // given
      const path = [ 'foo', 'bar' ];

      // when
      const canClaim = localPathRegistry.canClaimPath(path);

      // then
      expect(canClaim).to.be.true;
    });


    it('should NOT allow path claim when unavailable (closed over open)', function() {

      // given
      const path = [ 'foo', 'bar' ];
      localPathRegistry.claimPath(path, false);

      // when
      const canClaim = localPathRegistry.canClaimPath(path, true);

      // then
      expect(canClaim).to.be.false;
    });


    it('should NOT allow path claim when unavailable (closed over closed)', function() {

      // given
      const path = [ 'foo', 'bar' ];
      localPathRegistry.claimPath(path, true);

      // when
      const canClaim = localPathRegistry.canClaimPath(path, true);

      // then
      expect(canClaim).to.be.false;
    });


    it('should NOT allow path claim when unavailable (open over closed)', function() {

      // given
      const path = [ 'foo', 'bar' ];
      localPathRegistry.claimPath(path, true);

      // when
      const canClaim = localPathRegistry.canClaimPath(path, false);

      // then
      expect(canClaim).to.be.false;
    });

  });


  describe('#claimPath', function() {

    it('should NOT throw error when two same open paths are claimed', function() {

      // given
      const path = [ 'foo', 'bar' ];

      // when
      localPathRegistry.claimPath(path, false);

      // then
      expect(() => localPathRegistry.claimPath(path, false)).to.not.throw();
    });


    it('should throw error when two same closed paths are claimed', function() {

      // given
      const path = [ 'foo', 'bar' ];

      // when
      localPathRegistry.claimPath(path, true);

      // then
      expect(() => localPathRegistry.claimPath(path, true)).to.throw('cannot claim path \'foo.bar\'');
    });


    it('should throw error if a closed path would clash with an open path', function() {

      // given
      const path = [ 'foo', 'bar' ];

      // when
      localPathRegistry.claimPath(path, false);

      // then
      expect(() => localPathRegistry.claimPath(path, true)).to.throw('cannot claim path \'foo.bar\'');
    });


    it('should throw an error if a closed path would clash with an open path (2)', function() {

      // given
      const path = [ 'foo', 'bar' ];

      // when
      localPathRegistry.claimPath(path, false);

      // then
      expect(() => localPathRegistry.claimPath(path, true)).to.throw('cannot claim path \'foo.bar\'');
    });


    it('should NOT throw an error if a closed path is a subpath of an open path', function() {

      // given
      const path = [ 'foo', 'bar' ];

      // when
      localPathRegistry.claimPath(path, false);

      // then
      expect(() => localPathRegistry.claimPath([ 'foo', 'bar', 'baz' ], true)).to.not.throw();
    });


    it('should claim, unclaim and claim again without issue (closed)', function() {

      // given
      const path = [ 'foo', 'bar' ];

      // when
      localPathRegistry.claimPath(path, false);
      localPathRegistry.unclaimPath(path);

      // then
      expect(() => localPathRegistry.claimPath(path, false)).to.not.throw();
    });


    it('should claim, unclaim and claim again without issue (open)', function() {

      // given
      const path = [ 'foo', 'bar' ];

      // when
      localPathRegistry.claimPath(path, true);
      localPathRegistry.unclaimPath(path);

      // then
      expect(() => localPathRegistry.claimPath(path, true)).to.not.throw();
    });

  });


  describe('#unclaimPath', function() {

    it('should throw error when no path found', function() {

      // given
      const path = [ 'foo', 'bar' ];

      // then
      expect(() => localPathRegistry.unclaimPath(path)).to.throw('no open path found for \'foo.bar\'');
    });

  });


  describe('#executeRecursivelyOnFields', function() {

    it('should execute function recursively', function() {

      // given
      const field = {
        type: 'group',
        components: [
          { type: 'textfield' },
          { type: 'textfield' },
          { type: 'image' }
        ]
      };

      const spyFn = sinon.spy();

      // when
      localPathRegistry.executeRecursivelyOnFields(field, spyFn);

      // then
      expect(spyFn).to.have.been.calledThrice;
    });


    it('should not execute at all for non-bound fields', function() {

      // given
      const field = {
        type: 'default',
        components: [
          { type: 'image' },
          { type: 'image' },
          { type: 'image' }
        ]
      };

      const spyFn = sinon.spy();

      // when
      localPathRegistry.executeRecursivelyOnFields(field, spyFn);

      // then
      expect(spyFn).to.not.have.been.called;
    });


    it('should pass context down recursively', function() {

      // given
      const field = {
        type: 'group',
        components: [
          { type: 'textfield' },
          { type: 'textfield' },
          { type: 'image' }
        ]
      };

      const spyFn = sinon.spy();

      // when
      localPathRegistry.executeRecursivelyOnFields(field, spyFn, { foo: 'bar' });

      // then
      expect(spyFn).to.have.been.calledThrice;
      expect(spyFn.firstCall.args[0].context).to.eql({ foo: 'bar' });
      expect(spyFn.secondCall.args[0].context).to.eql({ foo: 'bar' });
    });


    it('should pass isClosed state to function', function() {

      // given
      const field = {
        type: 'group',
        components: [
          { type: 'textfield' },
          { type: 'textfield' },
          { type: 'image' }
        ]
      };

      const spyFn = sinon.spy();

      // when
      localPathRegistry.executeRecursivelyOnFields(field, spyFn);

      // then
      expect(spyFn).to.have.been.calledThrice;
      expect(spyFn.firstCall.args[0].isClosed).to.be.false;
      expect(spyFn.secondCall.args[0].isClosed).to.be.true;
    });


  });


  describe('#getValuePath', function() {

    it('should get simple value path', function() {

      // given
      const field = {
        id: 'FooID',
        type: 'textfield',
        key: 'foo'
      };

      // when
      const result = localPathRegistry.getValuePath(field);

      // then
      expect(result).to.eql([ 'foo' ]);
    });


    it('should get value path with replacement', function() {

      // given
      const field = {
        id: 'FooID',
        type: 'textfield',
        key: 'foo'
      };

      const options = { replacements: { FooID: 'bar' } };

      // when
      const result = localPathRegistry.getValuePath(field, options);

      // then
      expect(result).to.eql([ 'bar' ]);
    });


    it('should get value path with parent', function() {

      // given
      const parent = {
        id: 'BarID',
        type: 'group',
        path: 'bar'
      };

      const child = {
        id: 'FooID',
        type: 'textfield',
        key: 'foo',
        _parent: 'BarID'
      };

      localFormFieldRegistry.add(parent);

      // when
      const result = localPathRegistry.getValuePath(child);

      // then
      expect(result).to.eql([ 'bar', 'foo' ]);
    });


    it('should get value path with empty parent', function() {

      // given
      const parent = {
        id: 'BarID',
        type: 'group',
        path: ''
      };

      const child = {
        id: 'FooID',
        type: 'textfield',
        key: 'foo',
        _parent: 'BarID'
      };

      localFormFieldRegistry.add(parent);

      // when
      const result = localPathRegistry.getValuePath(child);

      // then
      expect(result).to.eql([ 'foo' ]);
    });


    it('should get value path with parent and replacement', function() {

      // given
      const parent = {
        id: 'BarID',
        type: 'group',
        path: 'bar'
      };

      const child = {
        id: 'FooID',
        type: 'textfield',
        key: 'foo',
        _parent: 'BarID'
      };

      localFormFieldRegistry.add(parent);
      const options = { replacements: { BarID: 'baz' } };

      // when
      const result = localPathRegistry.getValuePath(child, options);

      // then
      expect(result).to.eql([ 'baz', 'foo' ]);
    });


    it('should get value path with multiple levels of parents', function() {

      // given
      const grandparent = {
        id: 'GrandparentID',
        type: 'group',
        path: 'grandparent'
      };

      const parent = {
        id: 'ParentID',
        type: 'group',
        path: 'parent',
        _parent: 'GrandparentID'
      };

      const child = {
        id: 'ChildID',
        type: 'textfield',
        key: 'child',
        _parent: 'ParentID'
      };

      localFormFieldRegistry.add(grandparent);
      localFormFieldRegistry.add(parent);

      // when
      const result = localPathRegistry.getValuePath(child);

      // then
      expect(result).to.eql([ 'grandparent', 'parent', 'child' ]);
    });


    it('should get value path with multiple levels of parents with dot accessed paths', function() {

      // given
      const grandparent = {
        id: 'GrandparentID',
        type: 'group',
        path: 'grandparent.a'
      };

      const parent = {
        id: 'ParentID',
        type: 'group',
        path: 'parent.b',
        _parent: 'GrandparentID'
      };

      const child = {
        id: 'ChildID',
        type: 'textfield',
        key: 'child.c',
        _parent: 'ParentID'
      };

      localFormFieldRegistry.add(grandparent);
      localFormFieldRegistry.add(parent);

      // when
      const result = localPathRegistry.getValuePath(child);

      // then
      expect(result).to.eql([ 'grandparent', 'a', 'parent', 'b', 'child', 'c' ]);
    });

  });


  describe('#clear', function() {

    it('should clear all paths', function() {

      // given
      localPathRegistry.claimPath([ 'foo', 'bar' ], false);
      localPathRegistry.claimPath([ 'foo', 'bar', 'baz' ], true);
      localPathRegistry.claimPath([ 'foo', 'bar', 'qux' ], true);

      // when
      localPathRegistry.clear();

      // then
      expect(localPathRegistry._dataPaths).to.be.empty;
    });

  });

});
