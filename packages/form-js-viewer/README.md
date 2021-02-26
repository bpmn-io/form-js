# form-js-viewer - Form viewer powered by bpmn.io

This library exports a form viewer for viewing and submitting forms. Use [@bpmn-io/form-js-editor] to create and edit forms.


## Installation

```
npm install @bpmn-io/form-js-viewer
```


## Usage

```javascript
import { createForm } from '@bpmn-io/form-js-viewer';

const schema = {
  components: [
    {
      key: 'creditor',
      label: 'Creditor',
      type: 'textfield',
      validate: {
        required: true
      }
    }
  ]
};

const data = {
  creditor: 'John Doe Company'
};

const form = createForm({
  container: document.getElementById('form'),
  schema,
  data
});

form.on('submit', event => {
  console.log('Form <submit>', event);
});
```

Check out [a full example](https://github.com/bpmn-io/form-js-example).


## Styling

For proper styling include the `form-js.css` stylesheet and font used:

```html
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">

<link href="https://unpkg.com/@bpmn-io/form-js/dist/assets/form-js.css" rel="stylesheet">
```


## API

### `createForm({ container, data, schema }) => Form`

Create a form.


### `Form#submit() => { data: Data, errors: Errors }`

Submit a form programatically.

```javascript
const {
  data,
  errors
} = form.submit();

if (Object.keys(errors).length) {
  console.error('Form submitted with errors', errors);
}
```


### `Form#reset() => void`

Reset a form programatically.


### `Form#setProperty(key, value) => void`

Set a form property such as `readOnly`.

### `Form#on(event, fn) => void`

Subscribe to an [event](#events).


## Events

The form emits the `changed` and `submit` events you may hook into.

Both events receive `{ data, errors }` as a payload.


## License

Use under the terms of the [bpmn.io license](http://bpmn.io/license).