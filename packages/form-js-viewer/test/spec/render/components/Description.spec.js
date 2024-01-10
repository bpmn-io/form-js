import {
  render
} from '@testing-library/preact/pure';

import { Description } from '../../../../src/render/components/Description';

import {
  createFormContainer,
  expectNoViolations
} from '../../../TestHelper';

import { MockFormContext } from './helper';

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
      this.timeout(10000);

      // @Note(pinussilvestrus): we need to render a bit more here as
      // Firefox + Ubuntu has problems with the description element on its own
      // cf. https://github.com/bpmn-io/form-js/pull/824
      const result =
        render(
          <MockFormContext>
            <label for="foo">Foo</label>
            <input id="foo" />
            <Description
              id="foo"
              description="This a description" />
          </MockFormContext>
          , { container });

      // then
      await expectNoViolations(result.container);
    });

  });

});

// helpers //////////

function createDescription({ services, ...restOptions }) {

  const options = {
    ...restOptions
  };

  return render(
    <MockFormContext
      services={ services }
      options={ options }>
      <Description
        id={ options.id }
        description={ options.description } />
    </MockFormContext>,
    {
      container: options.container || container.querySelector('.fjs-form')
    }
  );
}