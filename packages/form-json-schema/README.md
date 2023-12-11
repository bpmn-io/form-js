> ℹ️ This project is a development tool and not intended for production usage.

# @bpmn-io/form-json-schema

JSON Schema for [form-js](https://github.com/bpmn-io/form-js). The schema is built on top of and validated by [`json-schema@draft-07`](https://json-schema.org/draft-07/json-schema-release-notes.html).


## Usage

Set the `$schema` attribute to reference the [JSON Schema definition](./resources/schema.json).

```js
{
  "$schema": "https://unpkg.com/@bpmn-io/form-json-schema/resources/schema.json",
  "type": "default",
  "schemaVersion": 11,
  "components": []
}
```

You can also use a specific version.

```js
"$schema": "https://unpkg.com/@bpmn-io/form-json-schema@0.2.0/resources/schema.json"
```

## Build and Run

Prepare the project by installing all dependencies:

```sh
npm install
```

Bundle [the source schema files](./src) together

```sh
npm run build
```

Execute the following command to run the generated schema against the tests

```sh
npm run test
```

## Schema compatibility notice

This schema is currently only compatible with following [form-js](https://github.com/bpmn-io/form-js) schema versions.

| JSON schema version | form-js schema version |
|---|---|
| >= 1.5.0  | <= 13 |
| >= 1.6.0  | <= 14 |

## License

Use under the terms of the [bpmn.io license](http://bpmn.io/license).
