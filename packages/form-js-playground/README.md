# @bpmn-io/form-js-playground

[![CI](https://github.com/bpmn-io/form-js/workflows/CI/badge.svg)](https://github.com/bpmn-io/form-js/actions?query=workflow%3ACI)

A tool to try out and explore [@bpmn-io/form-js](../form-js) in a playful manner.

![Playground Screenshot](./resources/screenshot.png)


## Usage

Integrate the playground into your application:

```javascript
import '@bpmn-io/form-js/dist/assets/form-js.css';
import '@bpmn-io/form-js/dist/assets/form-js-editor.css';
import '@bpmn-io/form-js/dist/assets/dragula.css';
import '@bpmn-io/form-js/dist/assets/properties-panel.css';
import '@bpmn-io/form-js-playground/dist/assets/form-js-playground.css';

import { Playground } from '@bpmn-io/form-js-playground';

const playground = new Playground({
  container: document.querySelector('#container'),
  schema,
  data
});

const {
  schema,
  data
} = playground.getState();
```

## Resources

* [Demo](https://demo.bpmn.io/form)
* [Issues](https://github.com/bpmn-io/form-js/issues)


## License

Use under the terms of the [bpmn.io license](http://bpmn.io/license).