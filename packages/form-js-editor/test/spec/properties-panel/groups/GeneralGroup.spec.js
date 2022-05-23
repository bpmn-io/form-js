import {
  cleanup,
  fireEvent,
  render
} from '@testing-library/preact/pure';

import { GeneralGroup } from '../../../../src/render/components/properties-panel/groups';

import { WithFormEditorContext, WithPropertiesPanel } from '../helper';

import { set } from 'min-dash';

import { INPUTS } from '../../../../src/render/components/properties-panel/Util';


describe('GeneralGroup', function() {

  afterEach(() => cleanup());


  describe('id', function() {

    it('should render for default', function() {

      // given
      const field = { type: 'default' };

      // when
      const { container } = renderGeneralGroup({ field });

      // then
      const idInput = findInput('id', container);

      expect(idInput).to.exist;
    });


    it('should NOT render for textfield', function() {

      // given
      const field = { type: 'textfield' };

      // when
      const { container } = renderGeneralGroup({ field });

      // then
      const idInput = findInput('id', container);

      expect(idInput).to.not.exist;
    });


    it('should read', function() {

      // given
      const field = {
        type: 'default',
        id: 'foobar'
      };

      // when
      const { container } = renderGeneralGroup({ field });

      // when
      const idInput = findInput('id', container);

      // then
      expect(idInput).to.exist;
      expect(idInput.value).to.equal('foobar');
    });


    it('should write', function() {

      // given
      const field = {
        type: 'default',
        id: 'foobar'
      };

      const editFieldSpy = sinon.spy((field, path, value) => set(field, path, value));

      const { container } = renderGeneralGroup({ field, editField: editFieldSpy });

      const idInput = findInput('id', container);

      // when
      fireEvent.input(idInput, { target: { value: 'newVal' } });

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.id).to.equal('newVal');
    });

  });


  describe('label', function() {

    it('should NOT render for default', function() {

      // given
      const field = { type: 'default' };

      // when
      const { container } = renderGeneralGroup({ field });

      // then
      const labelInput = findInput('label', container);

      expect(labelInput).to.not.exist;
    });


    it('should render for button', function() {

      // given
      const field = { type: 'button' };

      // when
      const { container } = renderGeneralGroup({ field });

      // then
      const labelInput = findInput('label', container);

      expect(labelInput).to.exist;
    });


    it('should render for INPUTS', function() {

      // given
      for (const type of INPUTS) {

        const field = { type };

        // when
        const { container } = renderGeneralGroup({ field });

        // then
        const labelInput = findInput('label', container);

        expect(labelInput).to.exist;
      }
    });


    it('should read', function() {

      // given
      const field = {
        type: 'button',
        label: 'foobar'
      };

      // when
      const { container } = renderGeneralGroup({ field });

      const labelInput = findInput('label', container);

      // then
      expect(labelInput).to.exist;
      expect(labelInput.value).to.equal('foobar');
    });


    it('should write', function() {

      // given
      const field = {
        type: 'button',
        label: 'foobar'
      };

      const editFieldSpy = sinon.spy((field, path, value) => set(field, path, value));

      const { container } = renderGeneralGroup({ field, editField: editFieldSpy });

      const labelInput = findInput('label', container);

      // when
      fireEvent.input(labelInput, { target: { value: 'newVal' } });

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.label).to.equal('newVal');
    });

  });


  describe('description', function() {

    it('should NOT render for default', function() {

      // given
      const field = { type: 'default' };

      // when
      const { container } = renderGeneralGroup({ field });

      // then
      const descriptionInput = findInput('description', container);

      expect(descriptionInput).to.not.exist;
    });


    it('should render for INPUTS', function() {

      // given
      for (const type of INPUTS) {

        const field = { type };

        // when
        const { container } = renderGeneralGroup({ field });

        // then
        const descriptionInput = findInput('description', container);

        expect(descriptionInput).to.exist;
      }
    });


    it('should read', function() {

      // given
      const field = {
        type: 'number',
        description: 'foobar'
      };

      // when
      const { container } = renderGeneralGroup({ field });

      // then
      const descriptionInput = findInput('description', container);

      // then
      expect(descriptionInput).to.exist;
      expect(descriptionInput.value).to.equal('foobar');
    });


    it('should write', function() {

      // given
      const field = {
        type: 'number',
        description: 'foobar'
      };

      const editFieldSpy = sinon.spy((field, path, value) => set(field, path, value));

      // when
      const { container } = renderGeneralGroup({ field, editField: editFieldSpy });

      const descriptionInput = findInput('description', container);

      // when
      fireEvent.input(descriptionInput, { target: { value: 'newVal' } });

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.description).to.equal('newVal');
    });

  });


  describe('key', function() {

    it('should NOT render for default', function() {

      // given
      const field = { type: 'default' };

      // when
      const { container } = renderGeneralGroup({ field });

      // then
      const keyInput = findInput('key', container);

      expect(keyInput).to.not.exist;
    });


    it('should render for INPUTS', function() {

      // given
      for (const type of INPUTS) {

        const field = { type };

        // when
        const { container } = renderGeneralGroup({ field });

        // then
        const keyInput = findInput('key', container);

        expect(keyInput).to.exist;
      }
    });


    it('should read', function() {

      // given
      const field = {
        type: 'number',
        key: 'foobar'
      };

      // when
      const { container } = renderGeneralGroup({ field });

      // then
      const keyInput = findInput('key', container);

      // then
      expect(keyInput).to.exist;
      expect(keyInput.value).to.equal('foobar');
    });


    it('should write', function() {

      // given
      const field = {
        type: 'number',
        key: 'foobar'
      };

      const editFieldSpy = sinon.spy((field, path, value) => set(field, path, value));

      const { container } = renderGeneralGroup({ field, editField: editFieldSpy });

      const keyInput = findInput('key', container);

      // when
      fireEvent.input(keyInput, { target: { value: 'newVal' } });

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.key).to.equal('newVal');
    });

  });


  describe('defaultValue', function() {

    it('should NOT render for default', function() {

      // given
      const field = { type: 'default' };

      // when
      const { container } = renderGeneralGroup({ field });

      // then
      const defaultValueInput = findInput('defaultValue', container);

      expect(defaultValueInput).to.not.exist;
    });


    it('should render for INPUTS', function() {

      // given
      for (const type of INPUTS.filter(i => ![ 'checklist', 'taglist' ].includes(i))) {

        const field = { type };

        // when
        const { container } = renderGeneralGroup({ field });

        // then
        const defaultValueEntry = findEntry('defaultValue', container);

        expect(defaultValueEntry).to.exist;
      }
    });


    it('should read', function() {

      // given
      const field = {
        type: 'textfield',
        defaultValue: 'foobar'
      };

      // when
      const { container } = renderGeneralGroup({ field });

      // then
      const defaultValueInput = findInput('defaultValue', container);

      // then
      expect(defaultValueInput).to.exist;
      expect(defaultValueInput.value).to.equal('foobar');
    });


    it('should write', function() {

      // given
      const field = {
        type: 'textfield',
        defaultValue: 'foobar'
      };

      const editFieldSpy = sinon.spy((field, path, value) => set(field, path, value));

      const { container } = renderGeneralGroup({ field, editField: editFieldSpy });

      const defaultValueInput = findInput('defaultValue', container);

      // when
      fireEvent.input(defaultValueInput, { target: { value: 'newVal' } });

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.defaultValue).to.equal('newVal');
    });

  });


  describe('action', function() {

    it('should NOT render for default', function() {

      // given
      const field = { type: 'default' };

      // when
      const { container } = renderGeneralGroup({ field });

      // then
      const actionInput = findSelect('action', container);

      expect(actionInput).to.not.exist;
    });


    it('should render for button', function() {

      // given
      const field = { type: 'button' };

      // when
      const { container } = renderGeneralGroup({ field });

      // then
      const actionInput = findSelect('action', container);

      expect(actionInput).to.exist;
    });


    it('should read', function() {

      // given
      const field = {
        type: 'button',
        action: 'submit'
      };

      // when
      const { container } = renderGeneralGroup({ field });

      // then
      const actionInput = findSelect('action', container);

      expect(actionInput).to.exist;
      expect(actionInput.value).to.equal('submit');
    });


    it('should write', function() {

      // given
      const field = {
        type: 'button',
        action: 'submit'
      };

      const editFieldSpy = sinon.spy((field, path, value) => set(field, path, value));

      const { container } = renderGeneralGroup({ field, editField: editFieldSpy });

      const actionInput = findSelect('action', container);

      // when
      fireEvent.input(actionInput, { target: { value: 'reset' } });

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.action).to.equal('reset');
    });

  });


  describe('text', function() {

    it('should NOT render for default', function() {

      // given
      const field = { type: 'default' };

      // when
      const { container } = renderGeneralGroup({ field });

      // then
      const textInput = findTextarea('text', container);

      expect(textInput).to.not.exist;
    });


    it('should render for text', function() {

      // given
      const field = { type: 'text' };

      // when
      const { container } = renderGeneralGroup({ field });

      // then
      const textInput = findTextarea('text', container);

      expect(textInput).to.exist;
    });


    it('should read', function() {

      // given
      const field = {
        type: 'text',
        text: 'foobar'
      };

      // when
      const { container } = renderGeneralGroup({ field });

      // then
      const textInput = findTextarea('text', container);

      expect(textInput).to.exist;
      expect(textInput.value).to.equal('foobar');
    });


    it('should write', function() {

      // given
      const field = {
        type: 'text',
        text: 'foobar'
      };

      const editFieldSpy = sinon.spy((field, path, value) => set(field, path, value));

      const { container } = renderGeneralGroup({ field, editField: editFieldSpy });

      const textInput = findTextarea('text', container);

      // when
      fireEvent.input(textInput, { target: { value: 'newVal' } });

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.text).to.equal('newVal');
    });

  });


  describe('disabled', function() {

    it('should NOT render for default', function() {

      // given
      const field = { type: 'default' };

      // when
      const { container } = renderGeneralGroup({ field });

      // then
      const disabledInput = findInput('disabled', container);

      expect(disabledInput).to.not.exist;
    });


    it('should render for INPUTS', function() {

      // given
      for (const type of INPUTS) {

        const field = { type };

        // when
        const { container } = renderGeneralGroup({ field });

        // then
        const disabledInput = findInput('disabled', container);

        expect(disabledInput).to.exist;
      }
    });


    it('should read', function() {

      // given
      const field = {
        type: 'number',
        disabled: true
      };

      // when
      const { container } = renderGeneralGroup({ field });

      const disabledInput = findInput('disabled', container);

      // then
      expect(disabledInput).to.exist;
      expect(disabledInput.checked).to.equal(true);
    });


    it('should write', function() {

      // given
      const field = {
        type: 'number',
        disabled: true
      };

      const editFieldSpy = sinon.spy((field, path, value) => set(field, path, value));

      const { container } = renderGeneralGroup({ field, editField: editFieldSpy });

      const disabledInput = findInput('disabled', container);

      // when
      fireEvent.click(disabledInput);

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.disabled).to.equal(false);
    });

  });

});


// helper ///////////////

function renderGeneralGroup(options) {
  const {
    editField,
    field
  } = options;

  const groups = [ GeneralGroup(field, editField) ];

  return render(WithFormEditorContext(WithPropertiesPanel({
    field,
    groups
  })));
}

function findEntry(id, container) {
  return container.querySelector(`[data-entry-id="${id}"]`);
}

function findInput(id, container) {
  return container.querySelector(`input[name="${id}"]`);
}

function findSelect(id, container) {
  return container.querySelector(`select[name="${id}"]`);
}

function findTextarea(id, container) {
  return container.querySelector(`textarea[name="${id}"]`);
}
