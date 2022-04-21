import {
  cleanup,
  fireEvent,
  render
} from '@testing-library/preact/pure';

import { ValidationGroup } from '../../../../src/render/components/properties-panel/groups';

import { prefixId } from '../../../../src/render/components/properties-panel/Util';

import { WithFormEditorContext } from '../helper';


describe('ValidationGroup', function() {

  afterEach(() => cleanup());


  describe('required', function() {

    it('should render for any field', function() {

      // when
      const { container } = render(WithFormEditorContext(ValidationGroup({ type: 'any' })));

      // then
      const checkboxInput = container.querySelector(`#${prefixId('required')}`);

      expect(checkboxInput).to.exist;
    });


    it('should read', function() {

      // given
      const field = {
        type: 'any',
        validate: {
          required: true
        }
      };

      const { container } = render(WithFormEditorContext(ValidationGroup(field)));

      // when
      const checkboxInput = container.querySelector(`#${prefixId('required')}`);

      // then
      expect(checkboxInput).to.exist;
      expect(checkboxInput.checked).to.be.true;
    });


    it('should write', function() {

      // given
      const field = {
        type: 'any',
        validate: {
          required: true
        }
      };

      const editFieldSpy = sinon.spy();

      const { container } = render(WithFormEditorContext(ValidationGroup(field, editFieldSpy)));

      const checkboxInput = container.querySelector(`#${prefixId('required')}`);

      // when
      fireEvent.click(checkboxInput);

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.validate.required).to.be.false;
    });

  });


  describe('minLength', function() {

    it('should render for textfield', function() {

      // when
      const { container } = render(WithFormEditorContext(ValidationGroup({ type: 'textfield' })));

      // then
      const minLengthInput = container.querySelector(`#${prefixId('minLength')}`);

      expect(minLengthInput).to.exist;
    });


    it('should NOT render for number', function() {

      // when
      const { container } = render(WithFormEditorContext(ValidationGroup({ type: 'number' })));

      // then
      const minLengthInput = container.querySelector(`#${prefixId('minLength')}`);

      expect(minLengthInput).to.not.exist;
    });


    it('should read', function() {

      // given
      const field = {
        type: 'textfield',
        validate: {
          minLength: 3
        }
      };

      const { container } = render(WithFormEditorContext(ValidationGroup(field)));

      // when
      const minLengthInput = container.querySelector(`#${prefixId('minLength')}`);

      // then
      expect(minLengthInput).to.exist;
      expect(minLengthInput.value).to.equal('3');
    });


    it('should write', function() {

      // given
      const field = {
        type: 'textfield',
        validate: {
          minLength: 3
        }
      };

      const editFieldSpy = sinon.spy();

      const { container } = render(WithFormEditorContext(ValidationGroup(field, editFieldSpy)));

      const minLengthInput = container.querySelector(`#${prefixId('minLength')}`);

      // when
      fireEvent.input(minLengthInput, { target: { value: '2' } });

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.validate.minLength).to.equal(2);
    });

  });


  describe('maxLength', function() {

    it('should render for textfield', function() {

      // when
      const { container } = render(WithFormEditorContext(ValidationGroup({ type: 'textfield' })));

      // then
      const maxLengthInput = container.querySelector(`#${prefixId('maxLength')}`);

      expect(maxLengthInput).to.exist;
    });


    it('should NOT render for number', function() {

      // when
      const { container } = render(WithFormEditorContext(ValidationGroup({ type: 'number' })));

      // then
      const maxLengthInput = container.querySelector(`#${prefixId('maxLength')}`);

      expect(maxLengthInput).to.not.exist;
    });


    it('should read', function() {

      // given
      const field = {
        type: 'textfield',
        validate: {
          maxLength: 3
        }
      };

      const { container } = render(WithFormEditorContext(ValidationGroup(field)));

      // when
      const maxLengthInput = container.querySelector(`#${prefixId('maxLength')}`);

      // then
      expect(maxLengthInput).to.exist;
      expect(maxLengthInput.value).to.equal('3');
    });


    it('should write', function() {

      // given
      const field = {
        type: 'textfield',
        validate: {
          maxLength: 3
        }
      };

      const editFieldSpy = sinon.spy();

      const { container } = render(WithFormEditorContext(ValidationGroup(field, editFieldSpy)));

      const maxLengthInput = container.querySelector(`#${prefixId('maxLength')}`);

      // when
      fireEvent.input(maxLengthInput, { target: { value: '2' } });

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.validate.maxLength).to.equal(2);
    });

  });


  describe('pattern', function() {

    it('should render for textfield', function() {

      // when
      const { container } = render(WithFormEditorContext(ValidationGroup({ type: 'textfield' })));

      // then
      const patternInput = container.querySelector(`#${prefixId('pattern')}`);

      expect(patternInput).to.exist;
    });


    it('should NOT render for number', function() {

      // when
      const { container } = render(WithFormEditorContext(ValidationGroup({ type: 'number' })));

      // then
      const patternInput = container.querySelector(`#${prefixId('pattern')}`);

      expect(patternInput).to.not.exist;
    });


    it('should read', function() {

      // given
      const field = {
        type: 'textfield',
        validate: {
          pattern: 'myPattern'
        }
      };

      const { container } = render(WithFormEditorContext(ValidationGroup(field)));

      // when
      const patternInput = container.querySelector(`#${prefixId('pattern')}`);

      // then
      expect(patternInput).to.exist;
      expect(patternInput.value).to.equal('myPattern');
    });


    it('should write', function() {

      // given
      const field = {
        type: 'textfield',
        validate: {
          pattern: 'myPattern'
        }
      };

      const editFieldSpy = sinon.spy();

      const { container } = render(WithFormEditorContext(ValidationGroup(field, editFieldSpy)));

      const patternInput = container.querySelector(`#${prefixId('pattern')}`);

      // when
      fireEvent.input(patternInput, { target: { value: 'foo' } });

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.validate.pattern).to.equal('foo');
    });

  });


  describe('min', function() {

    it('should NOT render for textfield', function() {

      // when
      const { container } = render(WithFormEditorContext(ValidationGroup({ type: 'textfield' })));

      // then
      const minInput = container.querySelector(`#${prefixId('min')}`);

      expect(minInput).to.not.exist;
    });


    it('should render for number', function() {

      // when
      const { container } = render(WithFormEditorContext(ValidationGroup({ type: 'number' })));

      // then
      const minInput = container.querySelector(`#${prefixId('min')}`);

      expect(minInput).to.exist;
    });


    it('should read', function() {

      // given
      const field = {
        type: 'number',
        validate: {
          min: 3
        }
      };

      const { container } = render(WithFormEditorContext(ValidationGroup(field)));

      // when
      const minInput = container.querySelector(`#${prefixId('min')}`);

      // then
      expect(minInput).to.exist;
      expect(minInput.value).to.equal('3');
    });


    it('should write', function() {

      // given
      const field = {
        type: 'number',
        validate: {
          min: 3
        }
      };

      const editFieldSpy = sinon.spy();

      const { container } = render(WithFormEditorContext(ValidationGroup(field, editFieldSpy)));

      const minInput = container.querySelector(`#${prefixId('min')}`);

      // when
      fireEvent.input(minInput, { target: { value: '2' } });

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.validate.min).to.equal(2);
    });

  });


  describe('max', function() {

    it('should NOT render for textfield', function() {

      // when
      const { container } = render(WithFormEditorContext(ValidationGroup({ type: 'textfield' })));

      // then
      const maxInput = container.querySelector(`#${prefixId('max')}`);

      expect(maxInput).to.not.exist;
    });


    it('should render for number', function() {

      // when
      const { container } = render(WithFormEditorContext(ValidationGroup({ type: 'number' })));

      // then
      const maxInput = container.querySelector(`#${prefixId('max')}`);

      expect(maxInput).to.exist;
    });


    it('should read', function() {

      // given
      const field = {
        type: 'number',
        validate: {
          max: 3
        }
      };

      const { container } = render(WithFormEditorContext(ValidationGroup(field)));

      // when
      const maxInput = container.querySelector(`#${prefixId('max')}`);

      // then
      expect(maxInput).to.exist;
      expect(maxInput.value).to.equal('3');
    });


    it('should write', function() {

      // given
      const field = {
        type: 'number',
        validate: {
          max: 3
        }
      };

      const editFieldSpy = sinon.spy();

      const { container } = render(WithFormEditorContext(ValidationGroup(field, editFieldSpy)));

      const maxInput = container.querySelector(`#${prefixId('max')}`);

      // when
      fireEvent.input(maxInput, { target: { value: '2' } });

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.validate.max).to.equal(2);
    });

  });

});