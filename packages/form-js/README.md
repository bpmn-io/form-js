# @bpmn-io/form-js

[![CI](https://github.com/bpmn-io/form-js/workflows/CI/badge.svg)](https://github.com/bpmn-io/form-js/actions?query=workflow%3ACI)

[View](../form-js-viewer), [edit](../form-js-editor) and [simulate](../form-js-playground/) JSON-based forms.

## Usage

This library exports a [form viewer](../form-js-viewer), [editor](../form-js-editor) and [playground](../form-js-playground).

### Display a form <a id="viewer" />

Renders a form based on [a form schema](./docs/FORM_SCHEMA.md) and existing data:

```javascript
import { Form } from '@bpmn-io/form-js';

const form = new Form({
  container: document.querySelector('#form'),
});

await form.importSchema(schema, data);

form.on('submit', (event) => {
  console.log(event.data, event.errors);
});
```

See [viewer documentation](./packages/form-js-viewer) for further details.

### Create and edit a form <a id="builder" />

Create a new form or edit an exsting one:

```javascript
import { FormEditor } from '@bpmn-io/form-js';

const formEditor = new FormEditor({
  container: document.querySelector('#form-editor'),
});

await formEditor.importSchema(schema);
```

See [editor documentation](./packages/form-js-editor) for further details.

### Create and simulate a form with input and output data <a id="playground" />

Create and simulate a form with input and output data:

```javascript
import { FormPlayground } from '@bpmn-io/form-js';

const formPlayground = new FormPlayground({
  container: document.querySelector('#form-playground'),
  schema,
  data,
});
```

See [playground documentation](./packages/form-js-playground) for further details.

### Retrieve schema variables from a form

Use the `getSchemaVariables` util to retrieve the variables defined in a form schema. This is useful to gather what data is consumed and produced by a form.

```javascript
import { getSchemaVariables } from '@bpmn-io/form-js';

const variables = getSchemaVariables(schema);

console.log('Schema variables', variables);
```

It is also possible to distinct between input and output variables:

```javascript
import { getSchemaVariables } from '@bpmn-io/form-js';

const outputVariables = getSchemaVariables(schema, { inputs: false });
const inputVariables = getSchemaVariables(schema, { outputs: false });
```

## Resources

- [Demo](https://demo.bpmn.io/form)
- [Issues](https://github.com/bpmn-io/form-js/issues)
- [Changelog](../form-js/CHANGELOG.md)
- [Form schema](../../docs/FORM_SCHEMA.md)

## License

Use under the terms of the [bpmn.io license](http://bpmn.io/license).
