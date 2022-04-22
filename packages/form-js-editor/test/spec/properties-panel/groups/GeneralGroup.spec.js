import {
  cleanup,
  fireEvent,
  render
} from '@testing-library/preact/pure';

import { GeneralGroup } from '../../../../src/render/components/properties-panel/groups';

import { prefixId } from '../../../../src/render/components/properties-panel/Util';

import { WithFormEditorContext } from '../helper';

import { set } from 'min-dash';

import { INPUTS } from '../../../../src/render/components/properties-panel/Util';


describe('GeneralGroup', function() {

  afterEach(() => cleanup());


  describe('id', function() {

    it('should render for default', function() {

      // when
      const { container } = render(WithFormEditorContext(GeneralGroup({ type: 'default' })));

      // then
      const idInput = container.querySelector(`#${prefixId('id')}`);

      expect(idInput).to.exist;
    });


    it('should render for textfield', function() {

      // when
      const { container } = render(WithFormEditorContext(GeneralGroup({ type: 'textfield' })));

      // then
      const idInput = container.querySelector(`#${prefixId('id')}`);

      expect(idInput).to.not.exist;
    });


    it('should read', function() {

      // given
      const field = {
        type: 'default',
        id: 'foobar'
      };

      const { container } = render(WithFormEditorContext(GeneralGroup(field)));

      // when
      const idInput = container.querySelector(`#${prefixId('id')}`);

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

      const { container } = render(WithFormEditorContext(GeneralGroup(field, editFieldSpy)));

      const idInput = container.querySelector(`#${prefixId('id')}`);

      // when
      fireEvent.input(idInput, { target: { value: 'newVal' } });

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.id).to.equal('newVal');
    });

  });


  describe('label', function() {

    it('should NOT render for default', function() {

      // when
      const { container } = render(WithFormEditorContext(GeneralGroup({ type: 'default' })));

      // then
      const labelInput = container.querySelector(`#${prefixId('label')}`);

      expect(labelInput).to.not.exist;
    });


    it('should render for button', function() {

      // when
      const { container } = render(WithFormEditorContext(GeneralGroup({ type: 'button' })));

      // then
      const labelInput = container.querySelector(`#${prefixId('label')}`);

      expect(labelInput).to.exist;
    });


    it('should render for INPUTS', function() {

      // given
      for (const type of INPUTS) {

        // when
        const { container } = render(WithFormEditorContext(GeneralGroup({ type })));

        // then
        const labelInput = container.querySelector(`#${prefixId('label')}`);

        expect(labelInput).to.exist;
      }
    });


    it('should read', function() {

      // given
      const field = {
        type: 'button',
        label: 'foobar'
      };

      const { container } = render(WithFormEditorContext(GeneralGroup(field)));

      // when
      const labelInput = container.querySelector(`#${prefixId('label')}`);

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

      const { container } = render(WithFormEditorContext(GeneralGroup(field, editFieldSpy)));

      const labelInput = container.querySelector(`#${prefixId('label')}`);

      // when
      fireEvent.input(labelInput, { target: { value: 'newVal' } });

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.label).to.equal('newVal');
    });

  });


  describe('description', function() {

    it('should NOT render for default', function() {

      // when
      const { container } = render(WithFormEditorContext(GeneralGroup({ type: 'default' })));

      // then
      const descriptionInput = container.querySelector(`#${prefixId('description')}`);

      expect(descriptionInput).to.not.exist;
    });


    it('should render for INPUTS', function() {

      // given
      for (const type of INPUTS) {

        // when
        const { container } = render(WithFormEditorContext(GeneralGroup({ type })));

        // then
        const descriptionInput = container.querySelector(`#${prefixId('description')}`);

        expect(descriptionInput).to.exist;
      }
    });


    it('should read', function() {

      // given
      const field = {
        type: 'number',
        description: 'foobar'
      };

      const { container } = render(WithFormEditorContext(GeneralGroup(field)));

      // when
      const descriptionInput = container.querySelector(`#${prefixId('description')}`);

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

      const { container } = render(WithFormEditorContext(GeneralGroup(field, editFieldSpy)));

      const descriptionInput = container.querySelector(`#${prefixId('description')}`);

      // when
      fireEvent.input(descriptionInput, { target: { value: 'newVal' } });

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.description).to.equal('newVal');
    });

  });


  describe('key', function() {

    it('should NOT render for default', function() {

      // when
      const { container } = render(WithFormEditorContext(GeneralGroup({ type: 'default' })));

      // then
      const keyInput = container.querySelector(`#${prefixId('key')}`);

      expect(keyInput).to.not.exist;
    });


    it('should render for INPUTS', function() {

      // given
      for (const type of INPUTS) {

        // when
        const { container } = render(WithFormEditorContext(GeneralGroup({ type })));

        // then
        const keyInput = container.querySelector(`#${prefixId('key')}`);

        expect(keyInput).to.exist;
      }
    });


    it('should read', function() {

      // given
      const field = {
        type: 'number',
        key: 'foobar'
      };

      const { container } = render(WithFormEditorContext(GeneralGroup(field)));

      // when
      const keyInput = container.querySelector(`#${prefixId('key')}`);

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

      const { container } = render(WithFormEditorContext(GeneralGroup(field, editFieldSpy)));

      const keyInput = container.querySelector(`#${prefixId('key')}`);

      // when
      fireEvent.input(keyInput, { target: { value: 'newVal' } });

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.key).to.equal('newVal');
    });

  });


  describe('defaultValue', function() {

    it('should NOT render for default', function() {

      // when
      const { container } = render(WithFormEditorContext(GeneralGroup({ type: 'default' })));

      // then
      const defaultValueInput = container.querySelector(`#${prefixId('defaultValue')}`);

      expect(defaultValueInput).to.not.exist;
    });


    it('should render for INPUTS', function() {

      // given
      for (const type of INPUTS.filter(i => i !== 'checklist')) {

        // when
        const { container } = render(WithFormEditorContext(GeneralGroup({ type })));

        // then
        const defaultValueInput = container.querySelector(`#${prefixId('defaultValue')}`);

        expect(defaultValueInput).to.exist;
      }
    });


    it('should read', function() {

      // given
      const field = {
        type: 'textfield',
        defaultValue: 'foobar'
      };

      const { container } = render(WithFormEditorContext(GeneralGroup(field)));

      // when
      const defaultValueInput = container.querySelector(`#${prefixId('defaultValue')}`);

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

      const { container } = render(WithFormEditorContext(GeneralGroup(field, editFieldSpy)));

      const defaultValueInput = container.querySelector(`#${prefixId('defaultValue')}`);

      // when
      fireEvent.input(defaultValueInput, { target: { value: 'newVal' } });

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.defaultValue).to.equal('newVal');
    });

  });


  describe('action', function() {

    it('should NOT render for default', function() {

      // when
      const { container } = render(WithFormEditorContext(GeneralGroup({ type: 'default' })));

      // then
      const actionInput = container.querySelector(`#${prefixId('action')}`);

      expect(actionInput).to.not.exist;
    });


    it('should render for button', function() {

      // when
      const { container } = render(WithFormEditorContext(GeneralGroup({ type: 'button' })));

      // then
      const actionInput = container.querySelector(`#${prefixId('action')}`);

      expect(actionInput).to.exist;
    });


    it('should read', function() {

      // given
      const field = {
        type: 'button',
        action: 'submit'
      };

      const { container } = render(WithFormEditorContext(GeneralGroup(field)));

      // when
      const actionInput = container.querySelector(`#${prefixId('action')}`);

      // then
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

      const { container } = render(WithFormEditorContext(GeneralGroup(field, editFieldSpy)));

      const actionInput = container.querySelector(`#${prefixId('action')}`);

      // when
      fireEvent.input(actionInput, { target: { value: 'reset' } });

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.action).to.equal('reset');
    });

  });


  describe('text', function() {

    it('should NOT render for default', function() {

      // when
      const { container } = render(WithFormEditorContext(GeneralGroup({ type: 'default' })));

      // then
      const textInput = container.querySelector(`#${prefixId('text')}`);

      expect(textInput).to.not.exist;
    });


    it('should render for text', function() {

      // when
      const { container } = render(WithFormEditorContext(GeneralGroup({ type: 'text' })));

      // then
      const textInput = container.querySelector(`#${prefixId('text')}`);

      expect(textInput).to.exist;
    });


    it('should read', function() {

      // given
      const field = {
        type: 'text',
        text: 'foobar'
      };

      const { container } = render(WithFormEditorContext(GeneralGroup(field)));

      // when
      const textInput = container.querySelector(`#${prefixId('text')}`);

      // then
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

      const { container } = render(WithFormEditorContext(GeneralGroup(field, editFieldSpy)));

      const textInput = container.querySelector(`#${prefixId('text')}`);

      // when
      fireEvent.input(textInput, { target: { value: 'newVal' } });

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.text).to.equal('newVal');
    });

  });


  describe('disabled', function() {

    it('should NOT render for default', function() {

      // when
      const { container } = render(WithFormEditorContext(GeneralGroup({ type: 'default' })));

      // then
      const disabledInput = container.querySelector(`#${prefixId('disabled')}`);

      expect(disabledInput).to.not.exist;
    });


    it('should render for INPUTS', function() {

      // given
      for (const type of INPUTS) {

        // when
        const { container } = render(WithFormEditorContext(GeneralGroup({ type })));

        // then
        const disabledInput = container.querySelector(`#${prefixId('disabled')}`);

        expect(disabledInput).to.exist;
      }
    });


    it('should read', function() {

      // given
      const field = {
        type: 'number',
        disabled: true
      };

      const { container } = render(WithFormEditorContext(GeneralGroup(field)));

      // when
      const disabledInput = container.querySelector(`#${prefixId('disabled')}`);

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

      const { container } = render(WithFormEditorContext(GeneralGroup(field, editFieldSpy)));

      const disabledInput = container.querySelector(`#${prefixId('disabled')}`);

      // when
      fireEvent.click(disabledInput);

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.disabled).to.equal(false);
    });

  });

});