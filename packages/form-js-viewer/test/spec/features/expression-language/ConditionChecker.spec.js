import { expect } from 'chai';
import * as sinon from 'sinon';
import { ConditionChecker } from '../../../../src/features/expressionLanguage/ConditionChecker';
import { FeelExpressionLanguage } from '../../../../src/features/expressionLanguage/FeelExpressionLanguage';
import { PathRegistry } from '../../../../src/core/PathRegistry';
import { FormFields } from '../../../../src/render/FormFields';
import { Form } from '../../../../src/Form';

describe('ConditionChecker', function () {
  let conditionChecker,
    form = {},
    fireSpy;

  beforeEach(function () {
    fireSpy = sinon.spy();
    const eventBus = { fire: fireSpy };
    const expressionLanguage = new FeelExpressionLanguage(eventBus);
    const formFields = new FormFields();
    conditionChecker = new ConditionChecker(
      { getForm: () => form },
      new PathRegistry({}, formFields, { get: () => {} }),
      expressionLanguage,
      eventBus,
      formFields,
    );
  });

  describe('#check', function () {
    it('should return null if there is no condition', function () {
      // when
      const result = conditionChecker.check();

      // then
      expect(result).to.be.null;
    });

    it('should return null for non-string condition', function () {
      // given
      const condition = 1;

      // when
      const result = conditionChecker.check(condition);

      // then
      expect(result).to.be.null;
    });

    it('should return null if condition does not start with =', function () {
      // given
      const condition = 'foo';

      // when
      const result = conditionChecker.check(condition);

      // then
      expect(result).to.be.null;
    });

    it('should return null and report error if condition has syntax error', function () {
      // given
      const condition = '=foo-';

      // when
      const result = conditionChecker.check(condition);

      // then
      expect(result).to.be.null;
      expect(fireSpy).to.have.been.calledWith('error');
      expect(fireSpy.args[0][1].error).to.be.instanceof(Error);
    });

    it('should return false if condition is not met', function () {
      // given
      const condition = '=2 + 2 = 5';

      // when
      const result = conditionChecker.check(condition);

      // then
      expect(result).to.be.false;
    });

    it('should return false if condition is not met (with data)', function () {
      // given
      const condition = '=2 + 2 = five';

      // when
      const result = conditionChecker.check(condition, { five: 5 });

      // then
      expect(result).to.be.false;
    });

    it('should return true if condition is met', function () {
      // given
      const condition = '=2 + 2 = 4';

      // when
      const result = conditionChecker.check(condition);

      // then
      expect(result).to.be.true;
    });

    it('should return true if condition is met (with data)', function () {
      // given
      const condition = '=2 + 2 = four';

      // when
      const result = conditionChecker.check(condition, { four: 4 });

      // then
      expect(result).to.be.true;
    });
  });

  describe('#getHiddenFieldIds', function () {
    beforeEach(function () {
      form = {
        type: 'default',
        components: [
          {
            id: 'Group_1',
            type: 'group',
            conditional: { hide: '=hideGroup' },
            components: [
              { id: 'Textfield_shown', key: 'shown', type: 'textfield' },
              { id: 'Textfield_hidden', key: 'hidden', type: 'textfield', conditional: { hide: '=true' } },
            ],
          },
        ],
      };
    });

    it('should report the fields hidden by an ancestor', function () {
      // when
      const result = conditionChecker.getHiddenFieldIds({ hideGroup: true });

      // then
      expect(Array.from(result)).to.have.members(['Group_1', 'Textfield_shown', 'Textfield_hidden']);
    });

    it('should report only the fields hidden by their own condition with <ownConditionOnly>', function () {
      // when
      const result = conditionChecker.getHiddenFieldIds({ hideGroup: true }, {}, { ownConditionOnly: true });

      // then
      expect(Array.from(result)).to.have.members(['Group_1', 'Textfield_hidden']);
    });

    describe('memoization', function () {
      let walkSpy;

      beforeEach(function () {
        walkSpy = sinon.spy(conditionChecker, '_walkConditions');
      });

      it('should resolve the conditions once for the same data', function () {
        // given
        const data = { hideGroup: true };

        // when
        const first = conditionChecker.getHiddenFieldIds(data);
        const second = conditionChecker.getHiddenFieldIds(data);
        const ownOnly = conditionChecker.getHiddenFieldIds(data, {}, { ownConditionOnly: true });

        // then
        expect(walkSpy).to.have.been.calledOnce;
        expect(Array.from(first)).to.have.members(['Group_1', 'Textfield_shown', 'Textfield_hidden']);
        expect(Array.from(second)).to.have.members(['Group_1', 'Textfield_shown', 'Textfield_hidden']);
        expect(Array.from(ownOnly)).to.have.members(['Group_1', 'Textfield_hidden']);
      });

      it('should resolve the conditions again for new data', function () {
        // given
        conditionChecker.getHiddenFieldIds({ hideGroup: true });

        // when
        const result = conditionChecker.getHiddenFieldIds({ hideGroup: false });

        // then
        expect(walkSpy).to.have.been.calledTwice;
        expect(Array.from(result)).to.have.members(['Textfield_hidden']);
      });

      it('should resolve the conditions again for another form', function () {
        // given
        const data = { hideGroup: true };

        conditionChecker.getHiddenFieldIds(data);

        // when
        form = {
          type: 'default',
          components: [{ id: 'Textfield_other', key: 'other', type: 'textfield', conditional: { hide: '=hideGroup' } }],
        };

        const result = conditionChecker.getHiddenFieldIds(data);

        // then
        expect(walkSpy).to.have.been.calledTwice;
        expect(Array.from(result)).to.have.members(['Textfield_other']);
      });
    });
  });

  describe('#applyConditions', function () {
    it('should filter out properties for which condition is not met', function () {
      // given
      form = {
        type: 'default',
        components: [
          {
            key: 'foo',
            type: 'textfield',
            conditional: {
              hide: '=2 + 2 = 4',
            },
          },
          {
            key: 'bar',
            type: 'textfield',
            conditional: {
              hide: '=2 + 2 = 5',
            },
          },
        ],
      };

      const properties = {
        foo: 'FOO',
        bar: 'BAR',
      };

      // when
      const result = conditionChecker.applyConditions(properties);

      // then
      expect(result).to.eql({
        bar: 'BAR',
      });
    });

    it('should filter out properties for which condition is not met (with data)', function () {
      // given
      form = {
        type: 'default',
        components: [
          {
            key: 'foo',
            type: 'textfield',
            conditional: {
              hide: '=2 + 2 = 4',
            },
          },
          {
            key: 'bar',
            type: 'textfield',
            conditional: {
              hide: '=2 + 2 = 5',
            },
          },
        ],
      };

      const properties = {
        foo: 'FOO',
        bar: 'BAR',
      };

      const data = {
        five: 5,
        four: 4,
      };

      // when
      const result = conditionChecker.applyConditions(properties, data);

      // then
      expect(result).to.eql({
        bar: 'BAR',
      });
    });
  });

  describe('#applyConditions (form)', function () {
    let viewer;

    async function createViewer(schema) {
      viewer = new Form();

      await viewer.importSchema(schema);

      return viewer.get('conditionChecker');
    }

    afterEach(function () {
      viewer && viewer.destroy();
      viewer = null;
    });

    it('should clear the children of a hidden group with path', async function () {
      // given
      const checker = await createViewer({
        type: 'default',
        components: [
          {
            id: 'Group_address',
            type: 'group',
            path: 'address',
            conditional: { hide: '=hideAddress' },
            components: [{ id: 'Textfield_street', key: 'street', type: 'textfield' }],
          },
          { id: 'Textfield_zip', key: 'address.zip', type: 'textfield' },
        ],
      });

      const data = { hideAddress: true, address: { street: 'Main Street', zip: '12345' } };

      // when
      const result = checker.applyConditions(data, data);

      // then
      expect(result).to.eql({ hideAddress: true, address: { zip: '12345' } });
    });

    it('should prune a parent object left empty', async function () {
      // given
      const checker = await createViewer({
        type: 'default',
        components: [
          {
            id: 'Group_address',
            type: 'group',
            path: 'address',
            conditional: { hide: '=hideAddress' },
            components: [{ id: 'Textfield_street', key: 'street', type: 'textfield' }],
          },
        ],
      });

      const data = { hideAddress: true, address: { street: 'Main Street' } };

      // when
      const result = checker.applyConditions(data, data);

      // then
      expect(result).to.eql({ hideAddress: true });
    });

    it('should clear a leaf of a nested group hidden by the outer group', async function () {
      // given
      const checker = await createViewer({
        type: 'default',
        components: [
          {
            id: 'Group_outer',
            type: 'group',
            path: 'outer',
            conditional: { hide: '=hideOuter' },
            components: [
              {
                id: 'Group_inner',
                type: 'group',
                path: 'inner',
                components: [{ id: 'Textfield_leaf', key: 'leaf', type: 'textfield' }],
              },
            ],
          },
          { id: 'Textfield_other', key: 'other', type: 'textfield' },
        ],
      });

      const data = { hideOuter: true, outer: { inner: { leaf: 'LEAF' } }, other: 'OTHER' };

      // when
      const result = checker.applyConditions(data, data);

      // then
      expect(result).to.eql({ hideOuter: true, other: 'OTHER' });
    });

    it('should clear a hidden leaf inside a visible group', async function () {
      // given
      const checker = await createViewer({
        type: 'default',
        components: [
          {
            id: 'Group_person',
            type: 'group',
            path: 'person',
            components: [
              { id: 'Textfield_name', key: 'name', type: 'textfield', conditional: { hide: '=hideName' } },
              { id: 'Number_age', key: 'age', type: 'number' },
            ],
          },
        ],
      });

      const data = { hideName: true, person: { name: 'Jane', age: 30 } };

      // when
      const result = checker.applyConditions(data, data);

      // then
      expect(result).to.eql({ hideName: true, person: { age: 30 } });
    });

    it('should clear the children of a hidden group without path', async function () {
      // given
      const checker = await createViewer({
        type: 'default',
        components: [
          {
            id: 'Group_unpathed',
            type: 'group',
            conditional: { hide: '=hideGroup' },
            components: [
              { id: 'Textfield_a', key: 'a', type: 'textfield' },
              { id: 'Textfield_b', key: 'b', type: 'textfield' },
            ],
          },
          { id: 'Textfield_c', key: 'c', type: 'textfield' },
        ],
      });

      const data = { hideGroup: true, a: 'A', b: 'B', c: 'C' };

      // when
      const result = checker.applyConditions(data, data);

      // then
      expect(result).to.eql({ hideGroup: true, c: 'C' });
    });

    it('should clear a list item child only where its item condition is met', async function () {
      // given
      const checker = await createViewer({
        type: 'default',
        components: [
          {
            id: 'List_items',
            type: 'dynamiclist',
            path: 'items',
            isRepeating: true,
            components: [
              { id: 'Checkbox_hide', key: 'hide', type: 'checkbox' },
              { id: 'Textfield_value', key: 'value', type: 'textfield', conditional: { hide: '=this.hide' } },
            ],
          },
        ],
      });

      const data = {
        items: [
          { hide: true, value: 'A' },
          { hide: false, value: 'B' },
        ],
      };

      // when
      const result = checker.applyConditions(data, data);

      // then
      expect(result).to.eql({
        items: [{ hide: true }, { hide: false, value: 'B' }],
      });
    });

    it('should clear a list item child in every item when its parent condition is met', async function () {
      // given
      const checker = await createViewer({
        type: 'default',
        components: [
          {
            id: 'List_items',
            type: 'dynamiclist',
            path: 'items',
            isRepeating: true,
            components: [
              { id: 'Textfield_label', key: 'label', type: 'textfield' },
              { id: 'Textfield_value', key: 'value', type: 'textfield', conditional: { hide: '=parent.hideAll' } },
            ],
          },
        ],
      });

      const data = {
        hideAll: true,
        items: [
          { label: 'one', value: 'A' },
          { label: 'two', value: 'B' },
        ],
      };

      // when
      const result = checker.applyConditions(data, data);

      // then
      expect(result).to.eql({
        hideAll: true,
        items: [{ label: 'one' }, { label: 'two' }],
      });
    });

    it('should remove the whole array of a hidden list', async function () {
      // given
      const checker = await createViewer({
        type: 'default',
        components: [
          {
            id: 'List_items',
            type: 'dynamiclist',
            path: 'items',
            isRepeating: true,
            conditional: { hide: '=hideList' },
            components: [{ id: 'Textfield_value', key: 'value', type: 'textfield' }],
          },
        ],
      });

      const data = { hideList: true, items: [{ value: 'A' }, { value: 'B' }] };

      // when
      const result = checker.applyConditions(data, data);

      // then
      expect(result).to.eql({ hideList: true });
    });

    it('should not mutate the given data', async function () {
      // given
      const checker = await createViewer({
        type: 'default',
        components: [
          {
            id: 'Group_address',
            type: 'group',
            path: 'address',
            conditional: { hide: '=hideAddress' },
            components: [{ id: 'Textfield_street', key: 'street', type: 'textfield' }],
          },
        ],
      });

      const data = { hideAddress: true, address: { street: 'Main Street' } };

      // when
      checker.applyConditions(data, data);

      // then
      expect(data).to.eql({ hideAddress: true, address: { street: 'Main Street' } });
    });

    it('should fire <conditionChecker.remove> for a hidden leaf', async function () {
      // given
      const checker = await createViewer({
        type: 'default',
        components: [
          { id: 'Textfield_name', key: 'name', type: 'textfield', conditional: { hide: '=hideName' } },
          { id: 'Textfield_other', key: 'other', type: 'textfield' },
        ],
      });

      const removeSpy = sinon.spy();

      viewer.on('conditionChecker.remove', removeSpy);

      const data = { hideName: true, name: 'Jane', other: 'OTHER' };

      // when
      checker.applyConditions(data, data);

      // then
      expect(removeSpy).to.have.been.calledOnce;
      expect(removeSpy.args[0][0].item).to.eql({ name: 'Jane' });
    });
  });
});
