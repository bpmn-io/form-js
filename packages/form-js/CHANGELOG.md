# Changelog

All notable changes to [form-js](https://github.com/bpmn-io/form-js) are documented here. We use [semantic versioning](http://semver.org/) for releases.

## Unreleased

___Note:__ Yet to be released changes appear here._

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
