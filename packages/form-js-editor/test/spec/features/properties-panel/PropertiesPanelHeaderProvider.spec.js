import {
  cleanup,
  render
} from '@testing-library/preact/pure';

import { PropertiesPanelHeaderProvider } from '../../../../src/features/properties-panel/PropertiesPanelHeaderProvider';

import { WithFormEditorContext, WithPropertiesPanel } from './helper';


describe('PropertiesPanelHeaderProvider', function() {

  afterEach(() => cleanup());

  it('should render icon', function() {

    // given
    const field = { type: 'textfield' };

    // when
    const { container } = renderHeader({ field });

    // then
    const icon = container.querySelector('.bio-properties-panel-header-icon');

    expect(icon).to.exist;
  });


  it('should render type', function() {

    // given
    const field = { type: 'textfield' };

    // when
    const { container } = renderHeader({ field });

    // then
    const type = container.querySelector('.bio-properties-panel-header-type');

    expect(type).to.exist;
    expect(type.innerText).to.eql('TEXT FIELD');
  });


  it('should render label', function() {

    // given
    const field = { type: 'textfield', label: 'foobar' };

    // when
    const { container } = renderHeader({ field });

    // then
    const label = container.querySelector('.bio-properties-panel-header-label');

    expect(label).to.exist;
    expect(label.innerText).to.eql(field.label);
  });

});


// helpers /////////

function renderHeader(options) {
  const {
    field
  } = options;

  return render(WithFormEditorContext(WithPropertiesPanel({
    field,
    headerProvider: PropertiesPanelHeaderProvider
  })));
}
