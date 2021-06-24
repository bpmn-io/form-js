# @bpmn-io/form-js-viewer

This library exports a form viewer for viewing and submitting forms. Use [our editor](../form-js-editor) to create and edit forms.


## Installation

```
npm install @bpmn-io/form-js-viewer
```


## Usage

```javascript
import { Form } from '@bpmn-io/form-js-viewer';

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

const form = new Form({
  container: document.querySelector('#form')
});

await form.importSchema(schema, data);

form.on('submit', event => {
  console.log('Form <submit>', event);
});
```

Check out [a full example](https://github.com/bpmn-io/form-js-examples).


## Styling

For proper styling include the `form-js.css` stylesheet and font used:

```html
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">

<link href="https://unpkg.com/@bpmn-io/form-js/dist/assets/form-js.css" rel="stylesheet">
```


## API

### `Form`

Create a new form with options `{ container?: HTMLElement }`.

```javascript
import { Form } from '@bpmn-io/form-js-viewer';

const form = new Form({
  container: document.querySelector('#form')
});
```


### `Form#importSchema(schema: Schema, data?: Data) => Promise<Result, Error>`

Display a form represented via a form schema and the optional data.

```javascript
try {
  await form.importSchema(schema);
} catch (err) {
  console.log('importing form failed', err);
}
```


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


### `Form#validate() => Errors`

Validate a form programatically.

```javascript
const errors = form.validate();

if (Object.keys(errors).length) {
  console.error('Form has errors', errors);
}
```


### `Form#reset() => void`

Reset a form programatically.


### `Form#setProperty(key, value) => void`

Set a form property such as `readOnly`.


### `Form#attachTo(parentNode: HTMLElement) => void`


Attach the form to a parent node.


### `Form#detach() => void`


Detach the form from its parent node.


### `Form#on(event, fn) => void`

Subscribe to an [event](#events).


### `Form#destroy() => void`

Remove form from the document.


## Events

The form emits the `changed` and `submit` events you may hook into.

Both events receive `{ data, errors }` as a payload.


## License

Use under the terms of the [bpmn.io license](http://bpmn.io/license).
