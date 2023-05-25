import {
  render
} from '@testing-library/preact/pure';

import Description from '../../../../src/render/components/Description';

import {
  createFormContainer,
  expectNoViolations
} from '../../../TestHelper';

import { WithFormContext } from './form-fields/helper';

let container;


describe('Description', function() {

  beforeEach(function() {
    container = createFormContainer();
  });

  afterEach(function() {
    container.remove();
  });


  it('should render', function() {

    // when
    const { container } = createDescription({
      id: 'foo',
      description: 'Foo'
    });

    // then
    const description = container.querySelector('.fjs-form-field-description');

    expect(description).to.exist;
    expect(description.textContent).to.eql('Foo');
  });


  it('should not render empty', function() {

    // when
    const { container } = createDescription({
      id: 'foo'
    });

    // then
    const description = container.querySelector('.fjs-form-field-description');

    expect(description).to.not.exist;
  });


  it('should render feel expression', function() {

    // when
    const { container } = createDescription({
      initialData: {
        myDescription: 'feel variable description'
      },
      id: 'foo',
      description: '=myDescription'
    });

    // then
    const description = container.querySelector('.fjs-form-field-description');

    expect(description).to.exist;
    expect(description.textContent).to.eql('feel variable description');
  });


  it('should render template', function() {

    // when
    const { container } = createDescription({
      initialData: {
        myDescription: 'template variable description'
      },
      id: 'foo',
      description: 'A {{myDescription}}'
    });

    // then
    const description = container.querySelector('.fjs-form-field-description');

    expect(description).to.exist;
    expect(description.textContent).to.eql('A template variable description');
  });


  describe('a11y', function() {

    it('should have no violations', async function() {

      // given
      this.timeout(5000);

      const { container } = createDescription({
        id: 'foo',
        description: 'Foo'
      });

      // then
      await expectNoViolations(container);
    });

  });

});

// helpers //////////

function createDescription(options = {}) {
  const {
    description,
    id,
    initialData
  } = options;

  return render(WithFormContext(
    <Description
      id={ id }
      description={ description } />,
    {
      ...options,
      initialData
    }
  ), {
    container: options.container || container.querySelector('.fjs-form')
  });
}