import { render } from '@testing-library/preact/pure';

import Palette from '../../../src/rendering/palette/Palette';

import { insertStyles } from '../../TestHelper';

insertStyles();


describe('palette', function() {

  let parent,
      container;

  beforeEach(function() {
    parent = document.createElement('div');

    parent.classList.add('fjs-container', 'fjs-editor-container');

    container = document.createElement('div');

    container.classList.add('fjs-palette-container');

    container.style.position = 'absolute';
    container.style.left = '0';

    parent.appendChild(container);

    document.body.appendChild(parent);
  });

  afterEach(function() {
    document.body.removeChild(parent);
  });


  it('should render entries', async function() {

    // given
    const result = createPalette({ container });

    // then
    expect(result.container.querySelectorAll('.fjs-palette-field')).to.have.length(7);

    expectEntries(result.container, [
      'textfield',
      'number',
      'checkbox',
      'radio',
      'select',
      'text',
      'button'
    ]);
  });

});

function createPalette(options = {}) {
  const { container } = options;

  return render(
    <Palette />,
    {
      container
    }
  );
}

function expectEntries(container, fieldTypes) {
  fieldTypes.forEach(fieldType => {
    expect(container.querySelector(`[data-field-type="${fieldType}"]`)).to.exist;
  });
}