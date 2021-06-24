# @bpmn-io/form-js-editor

An editor to create forms that can be displayed with the [form-js viewer](../form-js-viewer).


## Installation

```
npm install @bpmn-io/form-js-editor
```


## Usage

```javascript
import { FormEditor } from '@bpmn-io/form-js-editor';

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

const formEditor = new FormEditor({
  container: document.querySelector('#form-editor')
});

await formEditor.importSchema(schema);
```

Check out [a full example](https://github.com/bpmn-io/form-js-examples).


## Styling

For proper styling include the necessary stylesheets, and font used:

```html
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">

<link rel="stylesheet" href="https://unpkg.com/@bpmn-io/form-js@0.2.3/dist/assets/form-js.css">
<link rel="stylesheet" href="https://unpkg.com/@bpmn-io/form-js@0.2.3/dist/assets/form-js-editor.css">
<link rel="stylesheet" href="https://unpkg.com/@bpmn-io/form-js@0.2.3/dist/assets/dragula.css">
```


## API

### `FormEditor`

Create a new form editor with options `{ container?: HTMLElement }`.

```javascript
import { FormEditor } from '@bpmn-io/form-js-editor';

const formEditor = new FormEditor({
  container: document.querySelector('#form-editor')
});
```


### `FormEditor#importSchema(schema: Schema) => Promise<Result, Error>`

Display and edit a form represented via a form schema.

```javascript
try {
  await formEditor.importSchema(schema);
} catch (err) {
  console.log('importing form failed', err);
}
```


### `FormEditor#saveSchema() => Schema`

Export the form schema.

```javascript
const schema = formEditor.saveSchema(schema);

console.log('exported schema', schema);
```


### `FormEditor#attachTo(parentNode: HTMLElement) => void`


Attach the form editor to a parent node.


### `FormEditor#detach() => void`


Detach the form editor from its parent node.


### `FormEditor#on(event, fn) => void`

Subscribe to an [event](#events).


### `FormEditor#destroy() => void`

Remove form from editor the document.


## License

Use under the terms of the [bpmn.io license](http://bpmn.io/license).
