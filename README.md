# form-js - Forms powered by bpmn.io

[![CI](https://github.com/bpmn-io/form-js/workflows/CI/badge.svg)](https://github.com/bpmn-io/form-js/actions?query=workflow%3ACI)

[View](./packages/form-js-viewer) and [visually edit](./packages/form-js-editor) JSON-based forms.


## Usage

This library exports a form viewer and editor.

### Display a Form <a id="viewer" />

Renders a form based on [a form schema](./docs/FORM_SCHEMA.md) and existing data:

```javascript
import { createForm } from '@bpmn-io/form-js';

const form = await createForm({
  schema,
  data,
  container: document.querySelector('#form')
});

form.on('submit', (event) => {
  console.log(event.data, event.errors);
});
```

See [viewer documentation](./packages/form-js-viewer) for further details.


### Create and Edit a Form <a id="builder" />

Create a new form or edit an exsting one:

```javascript
import { createFormEditor } from '@bpmn-io/form-js';

const formEditor = await createFormEditor({
  schema,
  container: document.querySelector('#form-editor')
});
```

See [editor documentation](./packages/form-js-editor) for further details.


## Resources

* [Issues](https://github.com/bpmn-io/form-js/issues)
* [Changelog](./packages/form-js/CHANGELOG.md)
* [Form schema](./docs/FORM_SCHEMA.md)


## License

Use under the terms of the [bpmn.io license](http://bpmn.io/license).
