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
      expect(localPathRegistry.canClaimPath([ 'foo', 'bar' ])).to.equal(true);
    });


    it('should NOT allow path claim when unavailable (closed over open)', function() {
      localPathRegistry.claimPath([ 'foo', 'bar' ], false);
      expect(localPathRegistry.canClaimPath([ 'foo', 'bar' ], true)).to.equal(false);
    });


    it('should NOT allow path claim when unavailable (closed over closed)', function() {
      localPathRegistry.claimPath([ 'foo', 'bar' ], true);
      expect(localPathRegistry.canClaimPath([ 'foo', 'bar' ], true)).to.equal(false);
    });

  });


  describe('#claimPath', function() {

    it('should NOT throw error when two same open paths are claimed', function() {
      localPathRegistry.claimPath([ 'foo', 'bar' ], false);
      expect(() => localPathRegistry.claimPath([ 'foo', 'bar' ], false)).to.not.throw();
    });


    it('should throw error when two same closed paths are claimed', function() {
      localPathRegistry.claimPath([ 'foo', 'bar' ], true);
      expect(() => localPathRegistry.claimPath([ 'foo', 'bar' ], true)).to.throw('cannot claim path \'foo.bar\'');
    });


    it('should throw error if a closed path would clash with an open path', function() {
      localPathRegistry.claimPath([ 'foo', 'bar' ], false);
      expect(() => localPathRegistry.claimPath([ 'foo' ], true)).to.throw('cannot claim path \'foo\'');
    });


    it('should throw an error if a closed path would clash with an open path (2)', function() {
      localPathRegistry.claimPath([ 'foo', 'bar' ], false);
      expect(() => localPathRegistry.claimPath([ 'foo', 'bar' ], true)).to.throw('cannot claim path \'foo.bar\'');
    });


    it('should NOT throw an error if a closed path is a subpath of an open path', function() {
      localPathRegistry.claimPath([ 'foo', 'bar' ], false);
      expect(() => localPathRegistry.claimPath([ 'foo', 'bar', 'baz' ], true)).to.not.throw();
    });


    it('should claim, unclaim and claim again without issue (closed)', function() {
      localPathRegistry.claimPath([ 'foo', 'bar' ], false);
      localPathRegistry.unclaimPath([ 'foo', 'bar' ]);
      expect(() => localPathRegistry.claimPath([ 'foo', 'bar' ], false)).to.not.throw();
    });


    it('should claim, unclaim and claim again without issue (open)', function() {
      localPathRegistry.claimPath([ 'foo', 'bar' ], true);
      localPathRegistry.unclaimPath([ 'foo', 'bar' ]);
      expect(() => localPathRegistry.claimPath([ 'foo', 'bar' ], true)).to.not.throw();
    });

  });


  describe('#unclaimPath', function() {

    it('should throw error when no path found', function() {
      expect(() => localPathRegistry.unclaimPath([ 'foo', 'bar' ])).to.throw('no open path found for \'foo.bar\'');
    });

  });


  describe('#executeRecursivelyOnFields', function() {

    it('should execute function recursively', function() {
      const field = {
        type: 'group',
        components: [
          { type: 'textfield' },
          { type: 'textfield' },
          { type: 'image' }
        ]
      };

      const spyFn = sinon.spy();
      localPathRegistry.executeRecursivelyOnFields(field, spyFn);

      expect(spyFn).to.have.been.calledThrice;
    });


    it('should not execute at all for non-bound fields', function() {
      const field = {
        type: 'default',
        components: [
          { type: 'image' },
          { type: 'image' },
          { type: 'image' }
        ]
      };

      const spyFn = sinon.spy();

      localPathRegistry.executeRecursivelyOnFields(field, spyFn);

      expect(spyFn).to.not.have.been.called;
    });


    it('should pass context down recursively', function() {
      const field = {
        type: 'group',
        components: [
          { type: 'textfield' },
          { type: 'textfield' },
          { type: 'image' }
        ]
      };

      const spyFn = sinon.spy();
      localPathRegistry.executeRecursivelyOnFields(field, spyFn, { foo: 'bar' });

      expect(spyFn).to.have.been.calledThrice;
      expect(spyFn.firstCall.args[0].context).to.eql({ foo: 'bar' });
      expect(spyFn.secondCall.args[0].context).to.eql({ foo: 'bar' });
    });


    it('should pass isClosed state to function', function() {
      const field = {
        type: 'group',
        components: [
          { type: 'textfield' },
          { type: 'textfield' },
          { type: 'image' }
        ]
      };

      const spyFn = sinon.spy();
      localPathRegistry.executeRecursivelyOnFields(field, spyFn);

      expect(spyFn).to.have.been.calledThrice;
      expect(spyFn.firstCall.args[0].isClosed).to.be.false;
      expect(spyFn.secondCall.args[0].isClosed).to.be.true;
    });


  });


  describe('#getValuePath', function() {

    it('should get simple value path', function() {
      const field = {
        id: 'FooID',
        type: 'textfield',
        key: 'foo'
      };

      const result = localPathRegistry.getValuePath(field);
      expect(result).to.eql([ 'foo' ]);
    });


    it('should get value path with replacement', function() {
      const field = {
        id: 'FooID',
        type: 'textfield',
        key: 'foo'
      };

      const options = { replacements: { FooID: 'bar' } };

      const result = localPathRegistry.getValuePath(field, options);
      expect(result).to.eql([ 'bar' ]);
    });


    it('should get value path with parent', function() {

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
      const result = localPathRegistry.getValuePath(child);
      expect(result).to.eql([ 'bar', 'foo' ]);
    });


    it('should get value path with empty parent', function() {

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
      const result = localPathRegistry.getValuePath(child);
      expect(result).to.eql([ 'foo' ]);
    });


    it('should get value path with parent and replacement', function() {

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

      const result = localPathRegistry.getValuePath(child, options);
      expect(result).to.eql([ 'baz', 'foo' ]);
    });


    it('should get value path with multiple levels of parents', function() {

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

      const result = localPathRegistry.getValuePath(child);
      expect(result).to.eql([ 'grandparent', 'parent', 'child' ]);
    });


    it('should get value path with multiple levels of parents with dot accessed paths', function() {

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

      const result = localPathRegistry.getValuePath(child);

      expect(result).to.eql([ 'grandparent', 'a', 'parent', 'b', 'child', 'c' ]);

    });

  });


  describe('#clear', function() {

    it('should clear all paths', function() {
      localPathRegistry.claimPath([ 'foo', 'bar' ], false);
      localPathRegistry.claimPath([ 'foo', 'bar', 'baz' ], true);
      localPathRegistry.claimPath([ 'foo', 'bar', 'qux' ], true);
      localPathRegistry.clear();

      expect(localPathRegistry._dataPaths).to.be.empty;
    });

  });

});
