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
  type: 'default',
  components: [
    {
      key: 'creditor',
      label: 'Creditor',
      type: 'textfield',
      validate: {
        required: true,
      },
    },
  ],
};

const data = {
  creditor: 'John Doe Company',
};

const form = new Form({
  container: document.querySelector('#form'),
});

await form.importSchema(schema, data);

// add event listeners
form.on('submit', (event) => {
  console.log('Form <submit>', event);
});

// provide a priority to event listeners
form.on('changed', 500, (event) => {
  console.log('Form <changed>', event);
});
```

### Customize document preview requests

If you use the `documentPreview` field and need custom authentication for file downloads/previews,
you can provide a `documentEndpointBuilder` service via dependency injection.

```javascript
import { Form } from '@bpmn-io/form-js-viewer';

const DocumentPreviewRequestModule = {
  documentEndpointBuilder: [
    'value',
    {
      buildUrl: (document) => document.endpoint,
      buildRequestInit: (document) => ({
        headers: {
          'x-document-id': document.documentId,
        },
        credentials: 'include',
      }),
    },
  ],
};

const form = new Form({
  container: document.querySelector('#form'),
  additionalModules: [DocumentPreviewRequestModule],
});
```

`buildRequestInit` is optional, used to [configure the fetch request](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit). If omitted, document requests use the default `fetch(url)` behavior.

Check out [a full example](https://github.com/bpmn-io/form-js-examples).

## Styling

For proper styling include the `form-js.css` stylesheet and font used:

```html
<link
  href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,600;1,400&display=swap"
  rel="stylesheet" />

<link href="https://unpkg.com/@bpmn-io/form-js/dist/assets/form-js.css" rel="stylesheet" />
```

## API

### `Form`

Create a new form with options `{ container?: HTMLElement }`.

```javascript
import { Form } from '@bpmn-io/form-js-viewer';

const form = new Form({
  container: document.querySelector('#form'),
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
const { data, errors } = form.submit();

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

### Navigate multipage containers

The `multiPageNavigation` service reads and sets the page a multipage container shows. Containers and pages are identified by their `id`.

```javascript
const navigation = form.get('multiPageNavigation');

// the id of the page the container shows, or null
navigation.getActivePage('Multipage_1');

// move the container to a page, returns whether it shows the page
navigation.navigate('Multipage_1', 'Page_3');
```

`navigate` returns `false` if the container or the page is unknown, or if a condition hides the page. It does not validate the page the container leaves. Pass `{ validate: true }` to refuse the move while that page has errors, and show them on the fields.

A container inside a dynamic list has a page per list item. Pass the repetition `indexes` to both methods, e.g. `{ indexes: { List_1: 2 } }`.

A container hidden by a condition keeps its page and can be navigated. It shows the page once it is revealed. Resetting the form or importing a schema sends every container back to its first page. To keep the page across an import, store it from `multipage.pageChanged` and navigate to it once `importSchema` resolves:

```javascript
let position;

form.on('multipage.pageChanged', ({ formField, to }) => {
  position = { container: formField.id, page: to.id };
});

await form.importSchema(schema, data);

if (position) {
  form.get('multiPageNavigation').navigate(position.container, position.page);
}
```

## Events

### `changed :: { data, errors }`

Fired off every time there is a form state change.

### `submit :: { data, errors }`

Fired off on form submission.

### `import.done :: { error, warnings }`

Fired whenever a schema has finished importing, whether it succeeds or fails.

### `multipage.pageChanged :: { formField, from, to, indexes }`

Fired when a multipage container moves to another page, and when it opens on its first page. In that case `from` is `null`.

### Layouting events

- `form.layoutCleared`
- `form.layoutCalculated :: { rows }`

### Lifecycle Events

- `detach`
- `attach`
- `form.init`
- `form.clear`
- `form.destroy`
- `diagram.clear`
- `diagram.destroy`

### Formfield events

- `formField.add :: { formField }`
- `formField.remove :: { formField }`
- `formField.focus :: { formField }`
- `formField.blur :: { formField }`
- `formField.search :: { formField, value }`

## License

Use under the terms of the [bpmn.io license](http://bpmn.io/license).
