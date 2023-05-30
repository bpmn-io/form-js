import {
  cleanup,
  fireEvent,
  render
} from '@testing-library/preact/pure';

import { ValidationGroup } from '../../../../../src/features/properties-panel/groups';

import { WithFormEditorContext, WithPropertiesPanel } from '../helper';


describe('ValidationGroup', function() {

  afterEach(() => cleanup());

  describe('required', function() {

    it('should render for textfield', function() {

      // given
      const field = { type: 'textfield' };

      // when
      const { container } = renderValidationGroup({ field });

      // then
      const requiredInput = findInput('required', container);

      expect(requiredInput).to.exist;
    });


    it('should read', function() {

      // given
      const field = {
        type: 'textfield',
        validate: {
          required: true
        }
      };

      // when
      const { container } = renderValidationGroup({ field });

      // then
      const requiredInput = findInput('required', container);

      // then
      expect(requiredInput).to.exist;
      expect(requiredInput.checked).to.be.true;
    });


    it('should write', function() {

      // given
      const field = {
        type: 'textfield',
        validate: {
          required: true
        }
      };

      const editFieldSpy = sinon.spy();

      const { container } = renderValidationGroup({ field, editField: editFieldSpy });

      const requiredInput = findInput('required', container);

      // when
      fireEvent.click(requiredInput);

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.validate.required).to.be.false;
    });

  });

  describe('validationType', function() {

    it('should render for textfield', function() {

      // given
      const field = { type: 'textfield' };

      // when
      const { container } = renderValidationGroup({ field });

      // then
      const requiredSelect = findSelect('validationType', container);

      expect(requiredSelect).to.exist;
    });


    it('should read', function() {

      // given
      const field = {
        type: 'textfield',
        validate: {
          validationType: 'email'
        }
      };

      // when
      const { container } = renderValidationGroup({ field });

      // then
      const requiredSelect = findSelect('validationType', container);

      // then
      expect(requiredSelect).to.exist;
      expect(requiredSelect.value).to.equal('email');
    });


    it('should write', function() {

      // given
      const field = {
        type: 'textfield',
        validate: {
          validationType: 'email'
        }
      };

      const editFieldSpy = sinon.spy();

      const { container } = renderValidationGroup({ field, editField: editFieldSpy });

      const requiredSelect = findSelect('validationType', container);

      // when
      fireEvent.input(requiredSelect, { target: { value: 'phone' } });

      // then
      expect(editFieldSpy).to.have.been.calledWith(field, [ 'validate' ], { validationType: 'phone' });
      expect(field.validate.validationType).to.equal('phone');
    });


    it('should write - empty', function() {

      // given
      const field = {
        type: 'textfield',
        validate: {
          validationType: 'email'
        }
      };

      const editFieldSpy = sinon.spy();

      const { container } = renderValidationGroup({ field, editField: editFieldSpy });

      const requiredSelect = findSelect('validationType', container);

      // when
      fireEvent.input(requiredSelect, { target: { value: '' } });

      // then
      expect(editFieldSpy).to.have.been.calledWith(field, [ 'validate' ], {});
      expect(field.validate.validationType).to.not.exist;
    });

  });


  describe('minLength', function() {

    it('should render for textfield', function() {

      // given
      const field = { type: 'textfield' };

      // when
      const { container } = renderValidationGroup({ field });

      // then
      const minLengthInput = findInput('minLength', container);

      expect(minLengthInput).to.exist;
    });


    it('should NOT render for number', function() {

      // given
      const field = { type: 'number' };

      // when
      const { container } = renderValidationGroup({ field });

      // then
      const minLengthInput = findInput('minLength', container);

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

      // when
      const { container } = renderValidationGroup({ field });

      const minLengthInput = findInput('minLength', container);

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

      const { container } = renderValidationGroup({ field, editField: editFieldSpy });

      const minLengthInput = findInput('minLength', container);

      // when
      fireEvent.input(minLengthInput, { target: { value: '2' } });

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.validate.minLength).to.equal(2);
    });

  });


  describe('maxLength', function() {

    it('should render for textfield', function() {

      // given
      const field = { type: 'textfield' };

      // when
      const { container } = renderValidationGroup({ field });

      // then
      const maxLengthInput = findInput('maxLength', container);

      expect(maxLengthInput).to.exist;
    });


    it('should NOT render for number', function() {

      // given
      const field = { type: 'number' };

      // when
      const { container } = renderValidationGroup({ field });

      // then
      const maxLengthInput = findInput('maxLength', container);

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

      // when
      const { container } = renderValidationGroup({ field });

      const maxLengthInput = findInput('maxLength', container);

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

      const { container } = renderValidationGroup({ field, editField: editFieldSpy });

      const maxLengthInput = findInput('maxLength', container);

      // when
      fireEvent.input(maxLengthInput, { target: { value: '2' } });

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.validate.maxLength).to.equal(2);
    });

  });


  describe('pattern', function() {

    it('should render for textfield', function() {

      // given
      const field = { type: 'textfield' };

      // when
      const { container } = renderValidationGroup({ field });

      // then
      const patternInput = findInput('pattern', container);

      expect(patternInput).to.exist;
    });


    it('should NOT render for number', function() {

      // given
      const field = { type: 'number' };

      // when
      const { container } = renderValidationGroup({ field });

      // then
      const patternInput = findInput('pattern', container);

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

      // when
      const { container } = renderValidationGroup({ field });

      const patternInput = findInput('pattern', container);

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

      const { container } = renderValidationGroup({ field, editField: editFieldSpy });

      const patternInput = findInput('pattern', container);

      // when
      fireEvent.input(patternInput, { target: { value: 'foo' } });

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.validate.pattern).to.equal('foo');
    });

  });


  describe('min', function() {

    it('should render for number', function() {

      // given
      const field = { type: 'number' };

      // when
      const { container } = renderValidationGroup({ field });

      // then
      const minInput = findInput('min', container);

      expect(minInput).to.exist;
    });


    it('should NOT render for textfield', function() {

      // given
      const field = { type: 'textfield' };

      // when
      const { container } = renderValidationGroup({ field });

      // then
      const minInput = findInput('min', container);

      expect(minInput).to.not.exist;
    });


    it('should read', function() {

      // given
      const field = {
        type: 'number',
        validate: {
          min: 3
        }
      };

      // when
      const { container } = renderValidationGroup({ field });

      const minInput = findInput('min', container);

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

      const { container } = renderValidationGroup({ field, editField: editFieldSpy });

      const minInput = findInput('min', container);

      // when
      fireEvent.input(minInput, { target: { value: '2' } });

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.validate.min).to.equal(2);
    });


    it('should write decimal', function() {

      // given
      const field = {
        type: 'number',
        validate: {
          min: 3
        }
      };

      const editFieldSpy = sinon.spy();

      const { container } = renderValidationGroup({ field, editField: editFieldSpy });

      const minInput = findInput('min', container);

      // when
      fireEvent.input(minInput, { target: { value: '2.25' } });

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.validate.min).to.equal(2.25);
    });

  });


  describe('max', function() {

    it('should render for number', function() {

      // given
      const field = { type: 'number' };

      // when
      const { container } = renderValidationGroup({ field });

      // then
      const maxInput = findInput('max', container);

      expect(maxInput).to.exist;
    });


    it('should NOT render for textfield', function() {

      // given
      const field = { type: 'textfield' };

      // when
      const { container } = renderValidationGroup({ field });

      // then
      const maxInput = findInput('max', container);

      expect(maxInput).to.not.exist;
    });


    it('should read', function() {

      // given
      const field = {
        type: 'number',
        validate: {
          max: 3
        }
      };

      // when
      const { container } = renderValidationGroup({ field });

      const maxInput = findInput('max', container);

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

      const { container } = renderValidationGroup({ field, editField: editFieldSpy });

      const maxInput = findInput('max', container);

      // when
      fireEvent.input(maxInput, { target: { value: '2' } });

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.validate.max).to.equal(2);
    });


    it('should write decimal', function() {

      // given
      const field = {
        type: 'number',
        validate: {
          max: 3
        }
      };

      const editFieldSpy = sinon.spy();

      const { container } = renderValidationGroup({ field, editField: editFieldSpy });

      const maxInput = findInput('max', container);

      // when
      fireEvent.input(maxInput, { target: { value: '2.25' } });

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.validate.max).to.equal(2.25);
    });

  });

});


// helper ///////////////

function renderValidationGroup(options) {
  const {
    editField,
    field
  } = options;

  const groups = [ ValidationGroup(field, editField) ];

  return render(WithFormEditorContext(WithPropertiesPanel({
    field,
    groups
  })));
}

function findInput(id, container) {
  return container.querySelector(`input[name="${id}"]`);
}

function findSelect(id, container) {
  return container.querySelector(`select[name="${id}"]`);
}