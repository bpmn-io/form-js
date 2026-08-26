import { use as chaiUse } from 'chai';
import sinonChai from 'sinon-chai';

import { FormEditor } from '../src/FormEditor';

import TranslationCollector, { collectTranslations } from '@bpmn-io/form-js-i18n/tasks/TranslationCollector.js';

chaiUse(sinonChai);

// route every editor through the collector, so a collection run picks up the keys
// exercised by the whole suite rather than by dedicated specs
if (collectTranslations) {
  const getModules = FormEditor.prototype._getModules;

  FormEditor.prototype._getModules = function () {
    return [...getModules.call(this), TranslationCollector];
  };
}
