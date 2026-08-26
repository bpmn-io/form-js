import { use as chaiUse } from 'chai';
import sinonChai from 'sinon-chai';

import { Form } from '../src/Form';

import TranslationCollector, { collectTranslations } from '@bpmn-io/form-js-i18n/tasks/TranslationCollector.js';

chaiUse(sinonChai);

// route every form through the collector, so a collection run picks up the keys
// exercised by the whole suite rather than by dedicated specs
if (collectTranslations) {
  const getModules = Form.prototype._getModules;

  Form.prototype._getModules = function () {
    return [...getModules.call(this), TranslationCollector];
  };
}
