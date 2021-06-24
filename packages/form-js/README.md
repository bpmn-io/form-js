# @bpmn-io/form-js

[![CI](https://github.com/bpmn-io/form-js/workflows/CI/badge.svg)](https://github.com/bpmn-io/form-js/actions?query=workflow%3ACI)

[View](../form-js-viewer) and [edit](../form-js-editor) JSON-based forms.



## Usage

This library exports a [form viewer](./packages/form-js-viewer) and [editor](./packages/form-js-editor).

### Display a Form <a id="viewer" />

Renders a form based on [a form schema](./docs/FORM_SCHEMA.md) and existing data:

```javascript
import { Form } from '@bpmn-io/form-js';

const form = new Form({
  container: document.querySelector('#form')
});

await form.importSchema(schema, data);

form.on('submit', (event) => {
  console.log(event.data, event.errors);
});
```

See [viewer documentation](./packages/form-js-viewer) for further details.


### Create and Edit a Form <a id="builder" />

Create a new form or edit an exsting one:

```javascript
import { FormEditor } from '@bpmn-io/form-js';

const formEditor = new FormEditor({
  container: document.querySelector('#form-editor')
});

await formEditor.importSchema(schema);
```

See [editor documentation](./packages/form-js-editor) for further details.


## Resources

* [Demo](https://demo.bpmn.io/form)
* [Issues](https://github.com/bpmn-io/form-js/issues)
* [Changelog](../form-js/CHANGELOG.md)
* [Form schema](../../docs/FORM_SCHEMA.md)


## License

Use under the terms of the [bpmn.io license](http://bpmn.io/license).
