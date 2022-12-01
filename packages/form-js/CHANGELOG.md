# Changelog

All notable changes to [form-js](https://github.com/bpmn-io/form-js) are documented here. We use [semantic versioning](http://semver.org/) for releases.

## Unreleased

___Note:__ Yet to be released changes appear here._


## 0.10.0-alpha.2

### General

* `FEAT`: support decimal numbers ([#285](https://github.com/bpmn-io/form-js/issues/285))
* `FEAT`: add conditional rendering ([#374](https://github.com/bpmn-io/form-js/issues/374))
* `FEAT`: support `image` fields ([#383](https://github.com/bpmn-io/form-js/issues/383))
* `FEAT`: retrieve variables mentioned in conditions ([#401](https://github.com/bpmn-io/form-js/issues/401))
* `FEAT`: retrieve variables mentioned in expressions ([`32532aa7`](https://github.com/bpmn-io/form-js/commit/32532aa7d13b99ff621839300ba82282491fb9a8))
* `DEPS`: update to `diagram-js@11` ([`6e2d5a1d`](https://github.com/bpmn-io/form-js/commit/6e2d5a1d15fcd8a3c8c2b9787adcc637e46c552b))
* `DEPS`: update to `@bpmn-io/properties-panel@1` ([`fdda226f`](https://github.com/bpmn-io/form-js/commit/fdda226ff986532f6058a37dc647ac296ff3e8f4))


### Editor

* `FEAT`: validate `valuesKey` in properties panel ([#428](https://github.com/bpmn-io/form-js/issues/428))


## 0.10.0-alpha.1

### Editor

* `DEPS`: add `@bpmn-io/properties-panel` dependency ([#429](https://github.com/bpmn-io/form-js/pull/429))

### Viewer

* `FIX`: make `taglist` component accessible ([#413](https://github.com/bpmn-io/form-js/pull/429))

## 0.10.0-alpha.0

### General

* `FEAT`: add `textarea` component ([#283](https://github.com/bpmn-io/form-js/issues/283))
* `CHORE`: update to `schemaVersion@6` ([`5dd3f16c`](https://github.com/bpmn-io/form-js/commit/5dd3f16ca712eaa83b10d4f8059b8eac9bf81bc0))

### Viewer

* `CHORE`: add additional `.fjs-disabled` and `.fjs-checked` selectors ([#419](https://github.com/bpmn-io/form-js/pull/419))

### Editor

* `FEAT`: improve properties panel header for `text` fields ([#388](https://github.com/bpmn-io/form-js/issues/388))
* `FEAT`: add `email` validation type for `textfield` ([#414](https://github.com/bpmn-io/form-js/pull/414))
* `FEAT`: add `phone` validation type for `textfield` ([#414](https://github.com/bpmn-io/form-js/pull/414))

### Playground

* `FEAT`: enable JSON validation ([#386](https://github.com/bpmn-io/form-js/pull/386))
* `FEAT`: emit `formPlayground.inputDataError` ([`7341834b`](https://github.com/bpmn-io/form-js/commit/7341834bae4635970138f962583445867a89654e))


## 0.9.9

### Playground

* `FIX`: make JSON editors scrollable ([`2c155c1d`](https://github.com/bpmn-io/form-js/commit/2c155c1d2558de3dfd3f6b9da037879598f7f145))
* `FIX`: show submit data in output panel ([#273](https://github.com/bpmn-io/form-js/issues/273))

## 0.9.8

* `DEPS`: update to `diagram-js@9.0.0`
* `DEPS`: update to `eslint-plugin-bpmn-io@0.16.0`
* `DEPS`: update to `min-dom@4.0.0`

### Editor

* `FIX`: align default static values ([#355](https://github.com/bpmn-io/form-js/pull/355))

## 0.9.7

### Editor

* `FIX`: do not order values alphanumerical ([#350](https://github.com/bpmn-io/form-js/pull/350))

### Viewer

* `FIX`: inherit font family for inputs  ([#330](https://github.com/bpmn-io/form-js/pull/330))

## 0.9.6

### Editor

* `FIX`: ensure valueSource is undoable ([#349](https://github.com/bpmn-io/form-js/pull/349))
* `FIX`: scroll only palette fields ([#347](https://github.com/bpmn-io/form-js/pull/347))

### Playground

* `FIX`: fix overflowing palette container ([#348](https://github.com/bpmn-io/form-js/pull/348))

## 0.9.5

* `DEPS`: update to `didi@9`

## 0.9.4

* `CHORE`: update `package-lock.json` to v2

## 0.9.3

_Re-release of 0.9.2._

## 0.9.2

### General

* `CHORE`: upgrade to `properties-panel@0.21.0` ([b914b2f3](https://github.com/bpmn-io/form-js/commit/b914b2f3b862c0c9f2828f29e93ed2bbd076941c))


## 0.9.1

### Viewer

* `FIX`: increase description color contrast ([#334](https://github.com/bpmn-io/form-js/issues/334))


## 0.9.0

### Editor

* `CHORE`: show palette action names in compact mode ([`fc41baf9`](https://github.com/bpmn-io/form-js/commit/fc41baf97b4739ac8f688ea4dda3290f7d6dee8b))

### Playground

* `FEAT`: mirror editor API ([`30d4363b`](https://github.com/bpmn-io/form-js/commit/30d4363b524dd1f0159828f7b125db4cba415f82))
* `FEAT`: emit `formPlayground.init` after full initialization ([`dbb174c6`](https://github.com/bpmn-io/form-js/commit/dbb174c63a28e00bf3c9336192b5d5c46135867f))
* `FEAT`: allow to configure `exporter` ([#331](https://github.com/bpmn-io/form-js/issues/331))
* `FEAT`: make initial schema optional ([`e041c24a`](https://github.com/bpmn-io/form-js/commit/e041c24a86f3a5dc75ebba2cf5ac3ce724d65384))


## 0.8.0

### General

* `FEAT`: add playground distro ([#318](https://github.com/bpmn-io/form-js/issues/318))
* `FIX`: stop taglist duplicate entries during slowdowns  ([#268](https://github.com/bpmn-io/form-js/issues/268))

### Editor

* `FEAT`: provide properties panel module ([#286](https://github.com/bpmn-io/form-js/issues/286))
* `FEAT`: render properties panel per default ([#286](https://github.com/bpmn-io/form-js/issues/286))

### Playground

* `FEAT`: support components to be rendered flexible ([#292](https://github.com/bpmn-io/form-js/issues/292))
* `FEAT`: emit `formPlayground.rendered` event ([#292](https://github.com/bpmn-io/form-js/issues/292))
* `FEAT`: make it possible to render own properties panel ([#286](https://github.com/bpmn-io/form-js/issues/286))
* `CHORE`: clean up package definition ([#318](https://github.com/bpmn-io/form-js/issues/318))
* `CHORE`: use editor and viewer packages directly ([#318](https://github.com/bpmn-io/form-js/issues/318))

## 0.8.0-alpha.1

### General

* `FEAT`: provide `getSchemaVariables` utility ([#103](https://github.com/bpmn-io/form-js/issues/103))

### Editor

* `FEAT`: provide palette as feature module ([#280](https://github.com/bpmn-io/form-js/issues/280))
* `FIX`: remove term "process variable" from `key` property ([#241](https://github.com/bpmn-io/form-js/issues/241))
* `CHORE`: change labels `Values` to `Options` ([#304](https://github.com/bpmn-io/form-js/issues/304))

### Viewer

* `FEAT`: sanitize form field values on import ([#266](https://github.com/bpmn-io/form-js/issues/266))
* `FIX`: use outline for field focus state ([#267](https://github.com/bpmn-io/form-js/issues/267))
* `FIX`: filter invalid taglist options ([#303](https://github.com/bpmn-io/form-js/issues/303))

## 0.8.0-alpha.0

### General

* `FEAT`: add `checklist` component ([#196](https://github.com/bpmn-io/form-js/issues/196))
* `FEAT`: add `taglist` component ([#198](https://github.com/bpmn-io/form-js/issues/198))

### Editor

* `FEAT`: migrate properties panel to new framework ([#249](https://github.com/bpmn-io/form-js/issues/249))
* `FEAT`: allow to configure `valuesKey` ([#256](https://github.com/bpmn-io/form-js/issues/256))

### Viewer

* `FEAT`: load dynamic input data ([#197](https://github.com/bpmn-io/form-js/issues/197))

## 0.7.2

* `FIX`: serialize regex pattern as 'pattern' ([#245](https://github.com/bpmn-io/form-js/pull/245))
* `CHORE`: added build:watch script ([#248](https://github.com/bpmn-io/form-js/pull/248))
* `CHORE`: general local HTML coverage report ([#250](https://github.com/bpmn-io/form-js/pull/250))
* `CHORE`: format files to end with LF instead of CRLF ([#259](https://github.com/bpmn-io/form-js/issues/259))
* `DEPS`: cleaned up some audit errors ([#261](https://github.com/bpmn-io/form-js/pull/261))

## 0.7.1

* `FIX`: explicitly declare `Validator` dependencies ([#240](https://github.com/bpmn-io/form-js/issues/240))
* `FIX`: improve types ([#159](https://github.com/bpmn-io/form-js/issues/159))

## 0.7.0

### Editor

* `FEAT`: allow to set custom properties for form fields ([#226](https://github.com/bpmn-io/form-js/pull/226))
* `FIX`: validate TextInput when validate function changes ([#225](https://github.com/bpmn-io/form-js/pull/225))
* `FIX`: don't allow duplicate values for select and radio fields ([#229](https://github.com/bpmn-io/form-js/pull/229))

## 0.6.1

### Editor

* `FIX`: override `exporter` property on save ([#221](https://github.com/bpmn-io/form-js/pull/221))

## 0.6.0

### General

* `CHORE`: update color scheme ([#193](https://github.com/bpmn-io/form-js/pull/193))

### Viewer

* `FEAT`: be able to set default value of a field ([#213](https://github.com/bpmn-io/form-js/pull/213))
* `FIX`: submit data for every field that is not disabled ([#210](https://github.com/bpmn-io/form-js/pull/210))
* `FIX`: do not submit data without corresponding field ([#210](https://github.com/bpmn-io/form-js/pull/210))

### Editor

* `FIX`: prevent properties panel from losing focus ([#211](https://github.com/bpmn-io/form-js/pull/211))
* `CHORE`: properties panel inputs inherit font family ([#189](https://github.com/bpmn-io/form-js/pull/189))

### Breaking Changes

* Data will now be submitted for every form field that is not disabled.
* Imported data without form field will not be submitted anymore.

## 0.5.1

### Editor

* `FIX`: assign unique DOM IDs
* `FIX`: correctly handling of undo/redo shortcuts in form

### Viewer

* `FIX`: assign unique DOM IDs

## 0.5.0

### Editor

* `FEAT`: allow disabling of form fields ([#182](https://github.com/bpmn-io/form-js/pull/182), [#181](https://github.com/bpmn-io/form-js/issues/181))
* `FIX`: correct border radius on context pad ([#185](https://github.com/bpmn-io/form-js/pull/185))
* `FIX`: ensure form fields react to click events ([#186](https://github.com/bpmn-io/form-js/pull/186))

### Playground

_Initial public release of the `@bpmn-io/form-js-playground` :tada:._

## 0.4.4

### Viewer

* `FIX`: properly reset UI state of `select` and `number` fields ([#155](https://github.com/bpmn-io/form-js/issues/155))
* `FIX`: prevent un-checking of `radio` fields ([#176](https://github.com/bpmn-io/form-js/issues/176))
* `FIX`: correct display of `checkbox` fields without label ([#168](https://github.com/bpmn-io/form-js/issues/168))

## 0.4.3

### Editor

* `FIX`: correct form icon ([#170](https://github.com/bpmn-io/form-js/issues/170))

## 0.4.2

### Editor

* `FIX`: prevent generation of duplicate keys when creating form fields ([#161](https://github.com/bpmn-io/form-js/issues/161))
* `FIX`: make field hover and select state better distinguishable ([#163](https://github.com/bpmn-io/form-js/issues/163))

## 0.4.1

* `FIX`: update fields in registry on ID change ([#152](https://github.com/bpmn-io/form-js/issues/152))

## 0.4.0

* `FEAT`: refactor selection ([#140](https://github.com/bpmn-io/form-js/pull/140))
* `FEAT`: add selection behavior ([#140](https://github.com/bpmn-io/form-js/pull/140))
* `FEAT` add editor action to select form field ([#149](https://github.com/bpmn-io/form-js/pull/149))
* `FIX`: add missing select label to properties panel ([#148](https://github.com/bpmn-io/form-js/pull/148))
* `FIX`: fix palette overflow ([#147](https://github.com/bpmn-io/form-js/pull/147))
* `FIX`: fix type definitions for `container` option when creating form or form editor ([#145](https://github.com/bpmn-io/form-js/pull/145))

### Breaking Changes

* `Modeling#addFormField`, `Modeling#moveFormField` and `Modeling#remove` parameters have changed
* selection in `Selection` is now form field, not its ID

## 0.3.1

* `FIX`: use external type declarations ([#143](https://github.com/bpmn-io/form-js/pull/143))

## 0.3.0

### General

* `FEAT`: add `id` to form fields ([#80](https://github.com/bpmn-io/form-js/issues/80), [#137](https://github.com/bpmn-io/form-js/pull/137))
* `DOCS`: publish typings with documentation tags ([#138](https://github.com/bpmn-io/form-js/pull/138))
* `DOCS`: mark private and internal APIs
* `CHORE`: bump to `schemaVersion=2`

### Viewer

* `FEAT`: allow fields to be disabled via schema ([`bf185225`](https://github.com/bpmn-io/form-js/commit/bf185225f3545c54026f80c27a864119b2cd8107))
* `FIX`: assign unique keys for child components ([`cb86f75e`](https://github.com/bpmn-io/form-js/commit/cb86f75e3d7de96ceeb0c6e78553130358787f03), [`fd036484`](https://github.com/bpmn-io/form-js/commit/fd03648422cdd0331f10a60c9a1743aa02153300))
* `FIX`: santitize external links ([`9c53aa05`](https://github.com/bpmn-io/form-js/commit/9c53aa052dc5eb2fb37d320c0bbe334f2c3302fe))
* `FIX`: turn number field into a controlled component ([`874545e3`](https://github.com/bpmn-io/form-js/commit/874545e3b0290d0aff72359489d34596fd4cf769))
* `FIX`: correctly label selects ([`8eade6ca`](https://github.com/bpmn-io/form-js/commit/8eade6ca479604eb04ca08c6a17d32f73d465ead))

### Editor

* `FEAT`: add compact mode ([#130](https://github.com/bpmn-io/form-js/pull/130))
* `FEAT`: validate `key` property ([#58](https://github.com/bpmn-io/form-js/issues/58))
* `FEAT`: debounce input per default ([#132](https://github.com/bpmn-io/form-js/pull/132))
* `FEAT`: allow editing multiple properties at once ([`e68526c1`](https://github.com/bpmn-io/form-js/commit/e68526c14bae5e08ceecf4fb85d12de0081e60b6))
* `FEAT`: allow editing of form root ([`9193bb22`](https://github.com/bpmn-io/form-js/commit/9193bb220ea9be922433c026ecabe65542befb07))
* `FEAT`: improve form field selection and hover styles ([`71061807`](https://github.com/bpmn-io/form-js/commit/71061807451e99b73f913392bbfe2d5e8e340e3e))
* `FIX`: make form element drag sticky ([`e2c2bdd0`](https://github.com/bpmn-io/form-js/commit/e2c2bdd0f12539b0a0b049350a4a0d4763592d3f))
* `FIX`: clear before re-import ([#135](https://github.com/bpmn-io/form-js/issues/135))
* `FIX`: event listeners not de-registered ([#133](https://github.com/bpmn-io/form-js/issues/133))
* `FIX`: assign unique keys to rendered components ([#139](https://github.com/bpmn-io/form-js/pull/139))
* `CHORE`: rework import and field creation

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
