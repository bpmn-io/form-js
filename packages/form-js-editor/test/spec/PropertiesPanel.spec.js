import {
  fireEvent,
  render,
  screen
} from '@testing-library/preact/pure';

import PropertiesPanel, {
  Checkbox,
  Number,
  Textfield
} from '../../src/rendering/PropertiesPanel';

import schema from './form.json';

import { insertStyles } from '../TestHelper';

insertStyles();

const spy = sinon.spy;


describe('properties panel', function() {

  let parent,
      container;

  beforeEach(function() {
    parent = document.createElement('div');

    parent.classList.add('fjs-container', 'fjs-editor-container');

    container = document.createElement('div');

    container.classList.add('fjs-properties-container');

    container.style.position = 'absolute';
    container.style.right = '0';

    parent.appendChild(container);

    document.body.appendChild(parent);
  });

  afterEach(function() {
    document.body.removeChild(parent);
  });


  it('should render (no field)', async function() {

    // given
    const result = createPropertiesPanel({ container });

    // then
    expect(result.container.querySelector('.fjs-properties-panel-placeholder')).to.exist;
  });


  it('should render (field)', async function() {

    // given
    const field = schema.components.find(({ key }) => key === 'creditor');

    const result = createPropertiesPanel({
      container,
      field
    });

    // then
    expect(result.container.querySelector('.fjs-properties-panel-placeholder')).not.to.exist;

    expect(result.container.querySelector('.fjs-properties-panel-header-type')).to.exist;
    expect(result.container.querySelectorAll('.fjs-properties-panel-group')).to.have.length(2);
  });


  describe('properties', function() {

    describe('validation', function() {

      describe('maximum length', function() {

        it('should have min value of 0', function() {

          // given
          const editFieldSpy = spy((...args) => console.log(...args));

          const field = schema.components.find(({ key }) => key === 'creditor');

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Maximum Length');

          expect(input.min).to.equal('0');

          // when
          fireEvent.input(input, { target: { value: -1 } });

          fireEvent.input(input, { target: { value: 1 } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'validate' ], {
            ...field.validate,
            maxLength: 1
          });
        });

      });

      describe('minimum length', function() {

        it('should have min value of 0', function() {

          // given
          const editFieldSpy = spy((...args) => console.log(...args));

          const field = schema.components.find(({ key }) => key === 'creditor');

          createPropertiesPanel({
            container,
            editField: editFieldSpy,
            field
          });

          // assume
          const input = screen.getByLabelText('Minimum Length');

          expect(input.min).to.equal('0');

          // when
          fireEvent.input(input, { target: { value: -1 } });

          fireEvent.input(input, { target: { value: 1 } });

          // then
          expect(editFieldSpy).to.have.been.calledOnce;
          expect(editFieldSpy).to.have.been.calledWith(field, [ 'validate' ], {
            ...field.validate,
            minLength: 1
          });
        });

      });

    });

  });


  describe('inputs', function() {

    describe('checkbox', function() {

      it('should render', function() {

        // when
        const { container } = render(<Checkbox value={ false } />);

        // then
        const input = container.querySelector('input[type="checkbox"]');

        expect(input).to.exist;
        expect(input.checked).to.be.false;
      });


      it('should handle change', function() {

        // given
        const onChangeSpy = spy();

        const { container } = render(
          <Checkbox
            value={ false }
            onChange={ onChangeSpy } />
        );

        // when
        const input = container.querySelector('input[type="checkbox"]');

        fireEvent.change(input, { target: { checked: true } });

        // then
        expect(input.checked).to.be.true;

        expect(onChangeSpy).to.have.been.calledWith(true);
      });

    });


    describe('number', function() {

      it('should render', function() {

        // when
        const { container } = render(<Number value={ 123 } />);

        // then
        const input = container.querySelector('input[type="number"]');

        expect(input).to.exist;
        expect(input.value).to.equal('123');
      });


      it('should handle input (number)', function() {

        // given
        const onInputSpy = spy();

        const { container } = render(
          <Number
            value={ 123 }
            onInput={ onInputSpy } />
        );

        // when
        const input = container.querySelector('input[type="number"]');

        fireEvent.input(input, { target: { value: '124' } });

        // then
        expect(input.value).to.equal('124');

        expect(onInputSpy).to.have.been.calledWith(124);
      });


      it('should handle input (undefined)', function() {

        // given
        const onInputSpy = spy();

        const { container } = render(
          <Number
            value={ 123 }
            onInput={ onInputSpy } />
        );

        // when
        const input = container.querySelector('input[type="number"]');

        fireEvent.input(input, { target: { value: '' } });

        // then
        expect(input.value).to.equal('');

        expect(onInputSpy).to.have.been.calledWith(undefined);
      });

    });


    describe('textfield', function() {

      it('should render', function() {

        // when
        const { container } = render(<Textfield value="foo" />);

        // then
        const input = container.querySelector('input[type="text"]');

        expect(input).to.exist;
        expect(input.value).to.equal('foo');
      });


      it('should handle input (string)', function() {

        // given
        const onInputSpy = spy();

        const { container } = render(
          <Textfield
            value="foo"
            onInput={ onInputSpy } />
        );

        // when
        const input = container.querySelector('input[type="text"]');

        fireEvent.input(input, { target: { value: 'bar' } });

        // then
        expect(input.value).to.equal('bar');

        expect(onInputSpy).to.have.been.calledWith('bar');
      });


      it('should handle input (undefined)', function() {

        // given
        const onInputSpy = spy();

        const { container } = render(
          <Textfield
            value="foo"
            onInput={ onInputSpy } />
        );

        // when
        const input = container.querySelector('input[type="text"]');

        fireEvent.input(input, { target: { value: '' } });

        // then
        expect(input.value).to.equal('');

        expect(onInputSpy).to.have.been.calledWith(undefined);
      });

    });

  });

});

function createPropertiesPanel(options = {}) {
  const {
    container,
    editField = () => {},
    field = null
  } = options;

  return render(
    <PropertiesPanel
      editField={ editField }
      field={ field } />,
    {
      container
    }
  );
}