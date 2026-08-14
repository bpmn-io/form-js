import { expect } from 'chai';
import { act } from '@testing-library/preact/pure';
import userEvent from '@testing-library/user-event';

import { createForm } from '../../src';

import requiredSchema from './required.json';

/**
 * Translations are enabled, not provided: the viewer registers the default
 * `translate` and consumers override it at module configuration time, the same
 * way bpmn-js does.
 */
describe('translate', function () {
  let container, form;

  const bootstrapForm = (options) =>
    act(async () => {
      form = await createForm({ debounce: false, ...options });
    });

  /**
   * @param {Record<string, string>} dictionary
   */
  const createTranslate = (dictionary) => (template, replacements = {}) =>
    (dictionary[template] || template).replace(/{([^}]+)}/g, (_, key) => replacements[key] || '{' + key + '}');

  beforeEach(function () {
    container = document.createElement('div');

    document.body.appendChild(container);
  });

  afterEach(function () {
    document.body.removeChild(container);
    form && form.destroy();
    form = null;
  });

  it('should render English by default', async function () {
    // given
    await bootstrapForm({
      container,
      data: {},
      schema: requiredSchema,
    });

    // when
    await userEvent.click(container.querySelector('.fjs-button'));

    // then
    expect(container.innerHTML).to.contain('Field is required.');
  });

  it('should render a custom translation', async function () {
    // given
    const translate = createTranslate({ 'Field is required.': 'Pflichtfeld.' });

    await bootstrapForm({
      container,
      data: {},
      schema: requiredSchema,
      additionalModules: [{ translate: ['value', translate] }],
    });

    // when
    await userEvent.click(container.querySelector('.fjs-button'));

    // then
    expect(container.innerHTML).to.contain('Pflichtfeld.');
    expect(container.innerHTML).not.to.contain('Field is required.');
  });

  it('should interpolate replacements into a custom translation', async function () {
    // given
    const translate = createTranslate({
      'Field must have maximum value of {value}.': 'Maximalwert ist {value}.',
    });

    await bootstrapForm({
      container,
      data: { amount: 5 },
      schema: {
        type: 'default',
        components: [
          { type: 'number', key: 'amount', label: 'Amount', id: 'amount', validate: { max: 0 } },
          { type: 'button', action: 'submit', label: 'Submit', id: 'submit' },
        ],
      },
      additionalModules: [{ translate: ['value', translate] }],
    });

    // when
    await userEvent.click(container.querySelector('.fjs-button'));

    // then
    expect(container.innerHTML).to.contain('Maximalwert ist 0.');
  });
});
