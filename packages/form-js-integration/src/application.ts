import {
  createForm,
  createFormEditor,
  Form,
  FormEditor,
  FormPlayground,
  schemaVersion
} from '@bpmn-io/form-js';


/**
 * A TypeScript application that verifies our type
 * definitions are stable (enough).
 */
export async function createApp() {

  const container = document.querySelector('#app');

  await createForm({
    schema: {},
    data: {},
    container
  });

  await createFormEditor({
    schema: {},
    container
  });

  if (schemaVersion > 1) {
    console.log('schemaVersion > 1');
  }

  const form = new Form({ container });

  await form.importSchema({});
  await form.importSchema({}, {});

  form.setProperty('readonly', true);

  // eslint-disable-next-line
  const detachedForm = new Form();

  const formEditor = new FormEditor({ container });

  await formEditor.importSchema({});

  // eslint-disable-next-line
  const formEditorExtraOpts = new FormEditor({
    container: '#app',
    foo: {
      bar: true
    }
  });

  // eslint-disable-next-line
  const detachedFormEditor = new FormEditor();

  // eslint-disable-next-line
   const detachedPlayground = new FormPlayground({
    schema: {},
    data: {}
  });
}