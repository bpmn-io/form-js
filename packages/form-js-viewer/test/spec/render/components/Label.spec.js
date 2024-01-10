import {
  render
} from '@testing-library/preact/pure';

import { Label } from '../../../../src/render/components/Label';

import {
  createFormContainer,
  expectNoViolations
} from '../../../TestHelper';

import { MockFormContext } from './helper';

let container;


describe('Label', function() {

  beforeEach(function() {
    container = createFormContainer();
  });

  afterEach(function() {
    container.remove();
  });


  it('should render', function() {

    // when
    const { container } = createLabel({
      id: 'foo',
      label: 'Foo'
    });

    // then
    const label = container.querySelector('.fjs-form-field-label');

    expect(label).to.exist;
    expect(label.textContent).to.eql('Foo');
  });


  it('should render children', function() {

    // when
    const { container } = createLabel({
      id: 'foo',
      label: 'Foo'
    }, <span class="foo">Foo</span>);

    // then
    const label = container.querySelector('.foo');

    expect(label).to.exist;
  });


  it('should render asterisk if required', function() {

    // when
    const { container } = createLabel({
      id: 'foo',
      label: 'Foo',
      required: true
    });

    // then
    const label = container.querySelector('.fjs-asterix');

    expect(label).to.exist;
  });


  it('should render empty also without text', function() {

    // when
    const { container } = createLabel({
      id: 'foo',
      required: true
    });

    // then
    const label = container.querySelector('.fjs-form-field-label');
    const requiredIndicator = container.querySelector('.fjs-asterix');

    expect(label).to.exist;
    expect(requiredIndicator).to.exist;
  });


  it('should render feel expression', function() {

    // when
    const { container } = createLabel({
      initialData: {
        myLabel: 'feel variable label'
      },
      id: 'myLabel',
      label: '=myLabel'
    });

    // then
    const label = container.querySelector('.fjs-form-field-label');

    expect(label).to.exist;
    expect(label.textContent).to.eql('feel variable label');
  });


  it('should render template', function() {

    // when
    const { container } = createLabel({
      initialData: {
        myLabel: 'template variable label'
      },
      id: 'myLabel',
      label: 'A {{myLabel}}'
    });

    // then
    const label = container.querySelector('.fjs-form-field-label');

    expect(label).to.exist;
    expect(label.textContent).to.eql('A template variable label');
  });


  describe('a11y', function() {

    it('should have no violations', async function() {

      // given
      this.timeout(10000);

      const { container } = createLabel({
        id: 'foo',
        label: 'Foo'
      });

      // then
      await expectNoViolations(container);
    });

  });

});

// helpers //////////

function createLabel({ services, ...restOptions }, children = null) {

  const options = {
    ...restOptions
  };

  return render(
    <MockFormContext
      services={ services }
      options={ options }>
      <Label
        id={ options.id }
        label={ options.label }
        required={ options.required }>
        {children}
      </Label>
    </MockFormContext>, {
      container: options.container || container.querySelector('.fjs-form')
    }
  );
}
