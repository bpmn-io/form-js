import { use as chaiUse } from 'chai';
import sinonChai from 'sinon-chai';

import { Form } from '../src/Form';

import TranslationCollector, { collectTranslations } from '@bpmn-io/form-js-i18n/tasks/TranslationCollector.js';

chaiUse(sinonChai);

// route every instance through the collector, including specs that pass their own
// `modules`, so a collection run sees the keys the whole suite exercises
if (collectTranslations) {
  const createInjector = Form.prototype._createInjector;

  Form.prototype._createInjector = function (options, container) {
    // the collector goes first, so a spec that supplies its own `translate` still wins;
    // that spec's keys are then collected from wherever else the suite renders them
    const additionalModules = [TranslationCollector, ...(options.additionalModules || [])];

    return createInjector.call(this, { ...options, additionalModules }, container);
  };
}
