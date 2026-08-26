# @bpmn-io/form-js-i18n

Community maintained translations for the [form-js](https://github.com/bpmn-io/form-js) viewer and editor.

## Available translations

- [English](./translations/en.js)

See also the [translation coverage](https://github.com/bpmn-io/form-js/blob/develop/packages/form-js-i18n/docs/COVERAGE.md).

## Use a translation

```javascript
import { createForm } from '@bpmn-io/form-js';

import translations from '@bpmn-io/form-js-i18n/translations/en.js';

function customTranslate(template, replacements = {}) {
  return (translations[template] || template).replace(/{([^}]+)}/g, (_, key) => replacements[key] || '{' + key + '}');
}

createForm({
  container,
  schema,
  additionalModules: [{ translate: ['value', customTranslate] }],
});
```

The same module works for the editor via `createFormEditor`.

## Contribute a translation

Copy [`translations/en.js`](./translations/en.js) to `translations/<language>.js` and translate the values, leaving the keys untouched. `{placeholder}` markers are substituted at runtime and have to survive the translation, though they may be re-ordered to fit the language.

Then regenerate the coverage report:

```sh
npm run update-translations
```

Keys are collected from the form-js source by running `npm run collect-translations` in the repository root, which writes [`docs/translations.json`](https://github.com/bpmn-io/form-js/blob/develop/packages/form-js-i18n/docs/translations.json). `npm test` verifies every translation against that list and reports missing and outdated entries.

This package owns the whole i18n toolchain: the key list, the dictionaries, the karma reporter that writes the list (`tasks/translation-reporter.cjs`) and the `translate` module that feeds it (`tasks/TranslationCollector.js`). The viewer and editor test setups import the collector from here.
