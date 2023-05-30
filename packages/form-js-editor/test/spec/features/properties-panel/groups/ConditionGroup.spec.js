import {
  act,
  cleanup,
  render
} from '@testing-library/preact/pure';

import { ConditionGroup } from '../../../../../src/features/properties-panel/groups';

import { WithFormEditorContext, WithPropertiesPanel } from '../helper';

import { INPUTS } from '../../../../../src/features/properties-panel/Util';

const HIDE_CONDITION = 'conditional-hide';


describe('ConditionGroup', function() {

  afterEach(() => cleanup());


  describe('condition', function() {

    it('should NOT render for default', function() {

      // given
      const field = { type: 'default' };

      // when
      const group = ConditionGroup(field);

      // then
      expect(group).to.not.exist;
    });


    it('should render for INPUTS', function() {

      // given
      for (const type of INPUTS) {

        const field = { type };

        // when
        const { container } = renderConditionGroup({ field });

        // then
        const conditionInput = findInput(HIDE_CONDITION, container);

        expect(conditionInput).to.exist;
      }
    });


    it('should read', function() {

      // given
      const field = {
        type: 'button',
        conditional: {
          hide: 'foobar'
        }
      };

      // when
      const { container } = renderConditionGroup({ field });

      const conditionInput = findInput(HIDE_CONDITION, container);

      // then
      expect(conditionInput).to.exist;
      expect(conditionInput.innerText).to.equal('foobar');
    });


    it('should write', async function() {

      // given
      const field = {
        type: 'button',
        conditional: {
          hide: 'foobar'
        }
      };

      const editFieldSpy = sinon.spy();

      const { container } = renderConditionGroup({ field, editField: editFieldSpy });

      const conditionInput = findInput(HIDE_CONDITION, container);

      // when
      await changeInput(conditionInput, 'newVal');

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(editFieldSpy.args[0]).to.eql([ field, 'conditional', { hide: '=newVal' } ]);
    });


    it('should remove', async function() {

      // given
      const field = {
        type: 'button',
        conditional: {
          hide: 'foobar'
        }
      };

      const editFieldSpy = sinon.spy();

      const { container } = renderConditionGroup({ field, editField: editFieldSpy });

      const conditionInput = findInput(HIDE_CONDITION, container);

      // when
      await changeInput(conditionInput, '');

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(editFieldSpy.args[0]).to.eql([ field, 'conditional', undefined ]);
    });

  });
});


// helper ///////////////

function renderConditionGroup(options) {
  const {
    editField,
    field
  } = options;

  const groups = [ ConditionGroup(field, editField) ];

  return render(WithFormEditorContext(WithPropertiesPanel({
    field,
    groups
  })));
}

function changeInput(element, value) {
  return act(() => {
    element.textContent = value;
  });
}

function findInput(id, container) {
  return container.querySelector(`.bio-properties-panel-input[name="${id}"] [contenteditable]`);
}
