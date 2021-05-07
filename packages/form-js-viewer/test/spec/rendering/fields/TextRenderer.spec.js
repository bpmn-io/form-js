import { render } from '@testing-library/preact/pure';

import TextRenderer from '../../../../src/rendering/fields/TextRenderer';

import { createFormContainer } from '../../../TestHelper';

let container;


describe('TextRenderer', function() {

  beforeEach(function() {
    container = createFormContainer();
  });

  afterEach(function() {
    container.remove();
  });


  it('should render', function() {

    // when
    const { container } = createText();

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-text')).to.be.true;

    expect(container.querySelector('h1')).to.exist;
    expect(container.querySelector('ul')).to.exist;
    expect(container.querySelector('li')).to.exist;
  });


  it('#create', function() {

    // when
    const field = TextRenderer.create();

    // then
    expect(field).to.contain({
      type: 'text',
      text: '# Text'
    });

    expect(field.id).to.match(/text\d+/);
  });

});

// helpers //////////

const defaultField = {
  text: '# Text\n* Hello World',
  type: 'text'
};

function createText(options = {}) {
  const {
    disabled,
    errors,
    field = defaultField,
    onChange,
    path = [ defaultField.key ],
    value
  } = options;

  return render(
    <TextRenderer
      disabled={ disabled }
      errors={ errors }
      field={ field }
      onChange={ onChange }
      path={ path }
      value={ value } />,
    {
      container: options.container || container.querySelector('.fjs-form')
    }
  );
}