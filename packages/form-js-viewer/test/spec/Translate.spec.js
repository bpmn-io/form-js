import { expect } from 'chai';
import { act } from '@testing-library/preact/pure';
import userEvent from '@testing-library/user-event';

import { createForm } from '../../src';

import { collectTranslations } from '@bpmn-io/form-js-i18n/tasks/TranslationCollector.js';

import requiredSchema from './required.json';

// the fixtures below would otherwise end up in the collected keys
const suite = collectTranslations ? describe.skip : describe;

/**
 * Translations are enabled, not provided: the viewer registers the default
 * `translate` and consumers override it at module configuration time, the same
 * way bpmn-js does.
 */

suite('translate', function () {
  let container, form;

  const bootstrapForm = (options) =>
    act(async () => {
      form = await createForm({ debounce: false, ...options });
    });

  /**
   * @param {Record<string, string>} dictionary
   */
  const createTranslate =
    (dictionary) =>
    (template, replacements = {}) =>
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

  it('should place replacements where the translation puts them', async function () {
    // given
    // the placeholder does not sit where English puts it
    const translate = createTranslate({
      'Field must have maximum value of {value}.': '{value} ist der Maximalwert.',
    });

    await bootstrapForm({
      container,
      data: { amount: 5 },
      schema: numberSchema({ validate: { max: 3 } }),
      additionalModules: [{ translate: ['value', translate] }],
    });

    // when
    await userEvent.click(container.querySelector('.fjs-button'));

    // then
    expect(container.innerHTML).to.contain('3 ist der Maximalwert.');
  });

  it('should interpolate several replacements into one message', async function () {
    // given
    const translate = createTranslate({
      'Please select a valid value, the two nearest valid values are {previousValue} and {nextValue}.':
        'Gültig sind {previousValue} oder {nextValue}.',
    });

    await bootstrapForm({
      container,
      data: { amount: 5 },
      schema: numberSchema({ increment: '10' }),
      additionalModules: [{ translate: ['value', translate] }],
    });

    // when
    await userEvent.click(container.querySelector('.fjs-button'));

    // then
    expect(container.innerHTML).to.contain('Gültig sind 0 oder 10.');
  });

  it('should keep a replacement that the translation drops', async function () {
    // given
    // a translation is free to leave a placeholder out
    const translate = createTranslate({
      'Field must have maximum value of {value}.': 'Zu groß.',
    });

    await bootstrapForm({
      container,
      data: { amount: 5 },
      schema: numberSchema({ validate: { max: 3 } }),
      additionalModules: [{ translate: ['value', translate] }],
    });

    // when
    await userEvent.click(container.querySelector('.fjs-button'));

    // then
    expect(container.innerHTML).to.contain('Zu groß.');
    expect(container.innerHTML).not.to.contain('{value}');
  });

  it('should fall back to English for keys the dictionary omits', async function () {
    // given
    const translate = createTranslate({ 'Field is required.': 'Pflichtfeld.' });

    await bootstrapForm({
      container,
      data: { amount: 5 },
      schema: {
        type: 'default',
        components: [
          { type: 'textfield', key: 'name', label: 'Name', id: 'name', validate: { required: true } },
          { type: 'number', key: 'amount', label: 'Amount', id: 'amount', validate: { max: 3 } },
          { type: 'button', action: 'submit', label: 'Submit', id: 'submit' },
        ],
      },
      additionalModules: [{ translate: ['value', translate] }],
    });

    // when
    await userEvent.click(container.querySelector('.fjs-button'));

    // then
    expect(container.innerHTML).to.contain('Pflichtfeld.');
    expect(container.innerHTML).to.contain('Field must have maximum value of 3.');
  });
});

// helpers //////////

function numberSchema(field) {
  return {
    type: 'default',
    components: [
      { type: 'number', key: 'amount', label: 'Amount', id: 'amount', ...field },
      { type: 'button', action: 'submit', label: 'Submit', id: 'submit' },
    ],
  };
}
