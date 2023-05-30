import TestContainer from 'mocha-test-container-support';

import { useEffect } from 'preact/hooks';

import { waitFor } from '@testing-library/preact/pure';

import {
  insertStyles
} from '../../../TestHelper';

import {
  createFormEditor
} from '../../../../src';

import renderInjectionModule from '../../../../src/features/render-injection';

import schema from '../../form.json';

insertStyles();


describe('features/render-injection', function() {

  let formEditor, formContainer;

  beforeEach(function() {
    const container = TestContainer.get(this);

    formContainer = document.createElement('div');

    container.appendChild(formContainer);
  });

  afterEach(function() {
    const container = TestContainer.get(this);

    container.removeChild(formContainer);

    formEditor && formEditor.destroy();
  });

  async function createEditor(schema, options = {}) {
    const {
      additionalModules = [
        renderInjectionModule,
        ExtensionModule
      ]
    } = options;

    formEditor = await createFormEditor({
      schema,
      renderer: {
        container: formContainer
      },
      additionalModules,
      ...options
    });

    return { formEditor };
  }


  it('should inject renderered component', async function() {

    // when
    const spy = sinon.spy();
    const result = await createEditor(schema);
    formEditor = result.formEditor;

    const eventBus = formEditor.get('eventBus');

    eventBus.on('extension.rendered', spy);

    // then
    await waitFor(() => {
      expect(spy).to.have.been.calledOnce;
    });
  });


  it('should detach renderer', async function() {

    // when
    const attachSpy = sinon.spy();
    const detachSpy = sinon.spy();

    const result = await createEditor(schema);
    formEditor = result.formEditor;

    const eventBus = formEditor.get('eventBus');
    const renderInjector = formEditor.get('renderInjector');

    eventBus.on('extension.rendered', attachSpy);
    eventBus.on('extension.detached', detachSpy);

    // assume
    await waitFor(() => {
      expect(attachSpy).to.have.been.calledOnce;
    });


    // when
    renderInjector.detachRenderer('example-extension');

    // initiate re-render
    await formEditor.importSchema(schema);

    // then
    expect(detachSpy).to.have.been.calledOnce;

  });

});

// helper /////////

class ExampleExtension {
  constructor(renderInjector) {
    renderInjector.attachRenderer('example-extension', ExtensionComponent);
  }
}

ExampleExtension.$inject = [ 'renderInjector' ];

const ExtensionModule = {
  __init__: [ 'exampleExtension' ],
  'exampleExtension': [ 'type', ExampleExtension ],
};

function ExtensionComponent(props) {

  const { useService } = props;

  const eventBus = useService('eventBus');

  useEffect(() => {
    eventBus.fire('extension.rendered');

    return () => {
      eventBus.fire('extension.detached');
    };
  }, [ eventBus ]);

  return <div id="extension">I am an example</div>;
}