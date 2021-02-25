# form-js - Forms powered by bpmn.io

[![CI](https://github.com/bpmn-io/form-js/workflows/CI/badge.svg)](https://github.com/bpmn-io/form-js/actions?query=workflow%3ACI)

[View](../form-js-viewer) and edit JSON-based forms.


## Usage

This library exports a form viewer.

### Display a Form

Renders a form based on [a form schema](../../docs/FORM_SCHEMA.md) and existing data:

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

See [viewer documentation](../form-js-viewer) for further details.


## Resources

* [Issues](https://github.com/bpmn-io/form-js/issues)
* [Changelog](../form-js/CHANGELOG.md)
* [Form schema](../../docs/FORM_SCHEMA.md)


## License

Use under the terms of the [bpmn.io license](http://bpmn.io/license).
