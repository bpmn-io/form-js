# Changelog

All notable changes to [form-js](https://github.com/bpmn-io/form-js) are documented here. We use [semantic versioning](http://semver.org/) for releases.

## Unreleased

___Note:__ Yet to be released changes appear here._

## 0.2.4

* `FIX`: make options optional when creating `Form` and `FormEditor` instances ([`8d9e09ae`](https://github.com/bpmn-io/form-js/commit/8d9e09ae410cbfe42a8e11a2371e45df9d926fd0))
* `FIX`: import `schemaVersion` ([`05622a95`](https://github.com/bpmn-io/form-js/commit/05622a9568787a8c6f2fce79c60c7ff01f2b6083))
* `FIX`: ensure `required` works with empty string ([`0279c4c4`](https://github.com/bpmn-io/form-js/commit/0279c4c4e55a0d6c3cb7d57a6818b15ecd6a583e))
* `DOCS`: document new usage patterns ([#106](https://github.com/bpmn-io/form-js/issues/106))
* `DOCS`: document editor API ([#24](https://github.com/bpmn-io/form-js/issues/24))

## 0.2.3

* `FIX`: do not paragraph wrap `blockquote` and `ol` elements when rendering Markdown to HTML ([`a33d34ad`](https://github.com/bpmn-io/form-js/commit/a33d34ad584073bd3c9134997de94d325f88a0da))
* `FIX`: make HTML sanitizer more strict ([`122467df`](https://github.com/bpmn-io/form-js/commit/122467df3879afef69df0a7d9341638889a55d8c))
* `FIX`: gracefully handle unparseable `Text` input ([`a1121c0e`](https://github.com/bpmn-io/form-js/commit/a1121c0e7dc7a2e03854e9ff470dcdd4b6882faf))

## 0.2.2

* `FIX`: add missing `min-dom` dependency ([#100](https://github.com/bpmn-io/form-js/issues/100))
* `FIX`: improve sanitizing of text links ([#102](https://github.com/bpmn-io/form-js/issues/102))

## 0.2.1

* `FIX`: remove `async` from public API (polyfilling `Promise` is all that is needed)
* `CHORE`: expose `FormEditor` and `Form` in public API

## 0.2.0

### General

* `FIX`: prevent embedded images from breaking the form layout ([#92](https://github.com/bpmn-io/form-js/pull/92))
* `FIX`: generate proper paragraphs from markdown text ([#93](https://github.com/bpmn-io/form-js/pull/93))
* `CHORE`: refactor for extensibility and testability
* `CHORE`: separate component instantation and import

### Viewer

* `FEAT`: improve robustness of form import ([#79](https://github.com/bpmn-io/form-js/issues/79))
* `FEAT`: allow programmatic form validation ([#30](https://github.com/bpmn-io/form-js/issues/30))
* `FEAT`: prevent submission of readonly form
* `FIX`: correct submission of empty fields ([#54](https://github.com/bpmn-io/form-js/issues/54))
* `FIX`: correct submission of disabled fields ([#6](https://github.com/bpmn-io/form-js/issues/6))

### Editor

* `FEAT`: improve robustness of form editor import ([#91](https://github.com/bpmn-io/form-js/issues/91))
* `FEAT`: add undo and redo ([#45](https://github.com/bpmn-io/form-js/issues/45))

### Breaking Changes

* Form viewer and editor import are now asynchronous. Creating either via `#createForm` and `#createFormEditor` must be awaited.

## 0.1.0

_This release adds new form fields that are not supported by older versions of form-js._

### General

* `FEAT`: add `checkbox` field
* `FEAT`: add `radio` field
* `FEAT`: add `select` field
* `FEAT`: add read-only `text` field
* `FEAT`: add `number` field
* `CHORE`: add `UMD` distributions for `editor` and `viewer`

### Editor

* `FEAT`: make editor field preview match renderered form
* `FEAT`: add `schemaVersion` to exported form files
* `FEAT`: add ability to specify `exporter`

### Viewer

* `FEAT`: decrease visual presence of descriptions

## 0.0.12

* fix `required` checkbox in properties panel by passing correct props ([#53](https://github.com/bpmn-io/form-js/pull/53))

## 0.0.11

* fix drag and drop by adding/removing event listeners on mount/unmount and attach/detach ([#51](https://github.com/bpmn-io/form-js/pull/51))

## 0.0.10

* `FIX`: fix empty textfield and number input behavior in properties panel ([#42](https://github.com/bpmn-io/form-js/issues/42))

## 0.0.9

### Viewer

* `FEAT`: improve positioning of powered by logo
* `FEAT`: simplify initial form element labels
* `FIX`: restore `for` and `name` properties on inputs and labels ([#32](https://github.com/bpmn-io/form-js/issues/32))
* `FIX`: correct commonjs bundle issue ([#29](https://github.com/bpmn-io/form-js/issues/29))

### Editor

* `FEAT`: improve property labels
* `FEAT`: emit blur and focus events

## 0.0.8

_Re-publish of `v0.0.7`_.

## 0.0.7

### Viewer

* `FEAT`: fail on unknown form schema elements ([#27](https://github.com/bpmn-io/form-js/pull/27))
* `FEAT`: add `maxLength` validation

### Editor

_Initial editor release._

### Breaking Changes

* Form viewer instantiation now fails hard when supplied with an unsupported form schema.

## 0.0.6

### Viewer

* `FEAT`: emit `changed` event
* `CHORE`: remove debug logging

## 0.0.5

_Initial release._
