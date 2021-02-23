# form-js - Forms powered by bpmn.io

[![CI](https://github.com/bpmn-io/form-js/workflows/CI/badge.svg)](https://github.com/bpmn-io/form-js/actions?query=workflow%3ACI)

[View](./packages/form-js-viewer) and edit JSON-based forms.


## Usage

This library exports a form viewer.

### Display a Form

Renders a form based on [a form schema](./docs/FORM_DEFINITION.md) and existing data:

```javascript
import { createForm } from '@bpmn-io/form-js';

const form = createForm({
  schema,
  data,
  container: document.querySelector('#form')
});

form.on('submit', (event) => {
  console.log(event.data, event.errors);
});
```

See [viewer documentation](./packages/form-js-viewer) for further details.


## License

Use under the terms of the [bpmn.io license](http://bpmn.io/license).
