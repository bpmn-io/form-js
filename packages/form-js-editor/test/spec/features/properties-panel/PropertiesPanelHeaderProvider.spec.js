import {
  cleanup,
  render
} from '@testing-library/preact/pure';

import { FormFields } from '@bpmn-io/form-js-viewer';

import { PropertiesPanelHeaderProvider } from '../../../../src/features/properties-panel/PropertiesPanelHeaderProvider';

import { MockPropertiesPanelContext, TestPropertiesPanel } from './helper';


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


  describe('extension support', function() {

    it('should render type label from config', function() {

      // given
      const extension = {
        config: {
          label: 'Custom label',
          group: 'basic-input'
        }
      };

      const formFields = new FormFields();

      formFields.register('custom', extension);

      const field = { type: 'custom' };

      // when
      const { container } = renderHeader({ field, services: { formFields } });

      // then
      const label = container.querySelector('.bio-properties-panel-header-type');

      expect(label).to.exist;
      expect(label.innerText).to.eql(extension.config.label.toUpperCase());
    });


    it('should render icon from config', function() {

      // given
      const extension = {
        config: {
          label: 'Custom label',
          group: 'basic-input',
          icon: () => <div class="custom-icon">Custom Icon</div>
        }
      };

      const formFields = new FormFields();

      formFields.register('custom', extension);

      const field = { type: 'custom' };

      // when
      const { container } = renderHeader({ field, services: { formFields } });

      // then
      const customIcon = container.querySelector('.custom-icon');

      expect(customIcon).to.exist;
    });


    it('should render iconUrl from config', function() {

      // given
      const extension = {
        config: {
          label: 'Custom label',
          group: 'basic-input',
          iconUrl: 'https://example.com/icon.png'
        }
      };

      const formFields = new FormFields();

      formFields.register('custom', extension);

      const field = { type: 'custom' };

      // when
      const { container } = renderHeader({ field, services: { formFields } });

      // then
      const customIcon = container.querySelector('.fjs-field-icon-image');

      expect(customIcon).to.exist;
    });

  });

});


// helpers /////////

function renderHeader({ services, ...restOptions }) {

  const defaultField = { type: 'textfield' };

  const options = {
    field: defaultField,
    ...restOptions
  };

  return render(
    <MockPropertiesPanelContext options={ options } services={ services }>
      <TestPropertiesPanel field={ options.field } headerProvider={ PropertiesPanelHeaderProvider } />
    </MockPropertiesPanelContext>
  );
}
