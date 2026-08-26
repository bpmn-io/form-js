import { expect } from 'chai';
import { cleanup, render } from '@testing-library/preact/pure';

import { EditorHtml } from '../../../../../src/render/components/editor-form-fields/EditorHtml';

import { MockEditorContext } from '../../../../helper';

describe('EditorHtml', function () {
  afterEach(function () {
    return cleanup();
  });

  it('should render a placeholder for empty content', function () {
    // when
    const { container } = renderEditorHtml({ field: { type: 'html', content: '  ' } });

    // then
    expect(findPlaceholder(container)).to.eql('Html view is empty');
  });

  it('should render a placeholder for an expression', function () {
    // when
    const { container } = renderEditorHtml({
      field: { type: 'html', content: '=foo' },
      services: { expressionLanguage: { isExpression: () => true } },
    });

    // then
    expect(findPlaceholder(container)).to.eql('Html view is populated by an expression');
  });

  it('should render a placeholder for a template', function () {
    // when
    const { container } = renderEditorHtml({
      field: { type: 'html', content: '{{foo}}' },
      services: { templating: { isTemplate: () => true } },
    });

    // then
    expect(findPlaceholder(container)).to.eql('Html view is templated');
  });
});

// helper ///////////////

function renderEditorHtml({ services = {}, ...options }) {
  return render(
    <MockEditorContext services={services} options={options}>
      <EditorHtml {...options} />
    </MockEditorContext>,
  );
}

function findPlaceholder(container) {
  const placeholder = container.querySelector('.fjs-form-field-placeholder');

  return placeholder && placeholder.textContent;
}
