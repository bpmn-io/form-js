import axe from 'axe-core';

import {
  closest,
  query as domQuery
} from 'min-dom';

import { get, set } from 'min-dash';

import { pathStringify } from '../../util';

/**
 * https://www.deque.com/axe/core-documentation/api-documentation/#axe-core-tags
 */
const DEFAULT_AXE_RULES = [
  'best-practice',
  'wcag2a',
  'wcag2aa',
  'cat.semantics',
  'cat.forms'
];

export default class A11yValidation {

  constructor(config = {}, eventBus, form, formFieldRegistry) {
    const {
      rules = DEFAULT_AXE_RULES,
    } = config;

    this.setRules(rules);

    this._eventBus = eventBus;
    this._form = form;
    this._formFieldRegistry = formFieldRegistry;

    // todo(pinussilvestrus): enable this via config
    // eventBus.once('form.rendered', async () => await this.execute());
  }

  setRules(rules) {
    this._rules = rules;
  }

  async execute() {

    const result = await this.validate(this._form._container);

    const { violations } = result;

    // todo(pinussilvestrus): refactor me
    if (violations.length) {
      let a11yErrors = {};

      violations.forEach((violation) => {

        const { nodes } = violation;

        nodes.forEach((node) => {
          const { target } = node;

          const element = domQuery(target[0]);

          const formElement = closest(element, '[data-id]');

          const id = formElement.getAttribute('data-id');

          const formField = this._formFieldRegistry.get(id);

          const fieldErrors = get(a11yErrors, [ pathStringify(formField._path) ], []);

          fieldErrors.push(violation);

          return set(a11yErrors, [ pathStringify(formField._path) ], fieldErrors.length ? fieldErrors : undefined); });
      });

      this._form.setA11yErrors(a11yErrors);
    }
  }

  clear() {
    this._form.setA11yErrors({});
  }

  async validate(container) {
    const options = {};

    if (this._rules) {
      options.rules = this._rules;
    }

    return await axe.run(container, {
      runOnly: this._rules
    });
  }
}

A11yValidation.$inject = [ 'config.a11yValidation', 'eventBus', 'form', 'formFieldRegistry' ];