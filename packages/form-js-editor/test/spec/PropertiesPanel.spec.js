import {
  fireEvent,
  render
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

  let container;

  beforeEach(function() {
    container = document.createElement('div');

    container.style.height = '100%';

    document.body.appendChild(container);
  });

  afterEach(function() {
    document.body.removeChild(container);
  });


  it('should render (no field)', async function() {

    // given
    const { container } = createPropertiesPanel();

    // then
    expect(container.querySelector('.fjs-properties-panel-placeholder')).to.exist;
  });


  it('should render (field)', async function() {

    // given
    const field = schema.components.find(({ key }) => key === 'creditor');

    const { container } = createPropertiesPanel({
      field
    });

    // then
    expect(container.querySelector('.fjs-properties-panel-placeholder')).not.to.exist;

    expect(container.querySelector('.fjs-properties-panel-header-type')).to.exist;
    expect(container.querySelectorAll('.fjs-properties-panel-group')).to.have.length(2);
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
    editField = () => {},
    field = null
  } = options;

  return render(
    <PropertiesPanel
      editField={ editField }
      field={ field } />
  );
}