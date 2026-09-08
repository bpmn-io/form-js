import { expect } from 'chai';
import { act } from '@testing-library/preact/pure';
import userEvent from '@testing-library/user-event';

import { createForm } from '../../src';

import multiPageSchema from './multipage.json';

describe('MultiPage', function () {
  let container, form;

  const bootstrapForm = (options = {}) => {
    return act(async () => {
      form = await createForm({ debounce: false, container, schema: multiPageSchema, ...options });
    });
  };

  const activePage = () => {
    const pages = Array.from(container.querySelectorAll('.fjs-form-field-page'));

    return pages.find((page) => page.closest('.fjs-layout-row').style.display !== 'none');
  };

  const clickButton = async (label) => {
    const button = Array.from(container.querySelectorAll('.fjs-multipage-navigation button')).find(
      (candidate) => candidate.textContent === label,
    );

    expect(button, `expected a <${label}> button`).to.exist;

    await act(() => userEvent.click(button));
  };

  const fill = async (key, value) => {
    const input = container.querySelector(`.fjs-form-field-textfield input[id$="${key}"]`);

    expect(input, `expected an input for <${key}>`).to.exist;

    await act(() => userEvent.type(input, value));
  };

  beforeEach(function () {
    container = document.createElement('div');

    document.body.appendChild(container);
  });

  afterEach(function () {
    document.body.removeChild(container);
    form && form.destroy();
    form = null;
  });

  it('should show only the first page', async function () {
    // when
    await bootstrapForm();

    // then
    expect(container.querySelectorAll('.fjs-form-field-page')).to.have.length(2);
    expect(activePage().getAttribute('aria-labelledby')).to.exist;
    expect(activePage().querySelector('label').textContent).to.equal('Account type');
  });

  it('should hide a page by condition', async function () {
    // when
    await bootstrapForm();

    // then
    // Page_2 is hidden while the account type is not "business"
    const labels = Array.from(container.querySelectorAll('.fjs-form-field-page > label')).map(
      (label) => label.textContent,
    );

    expect(labels).to.eql(['Account type', 'Summary']);
  });

  it('should reveal a page once its condition no longer hides it', async function () {
    // given
    await bootstrapForm();

    // when
    await fill('accountType', 'business');

    // then
    const labels = Array.from(container.querySelectorAll('.fjs-form-field-page > label')).map(
      (label) => label.textContent,
    );

    expect(labels).to.eql(['Account type', 'Company details', 'Summary']);
  });

  it('should use the labels of the page on screen', async function () {
    // when
    await bootstrapForm();

    // then
    const labels = Array.from(container.querySelectorAll('.fjs-multipage-navigation button')).map(
      (button) => button.textContent,
    );

    expect(labels).to.eql(['Continue']);
  });

  it('should navigate forwards and backwards', async function () {
    // given
    await bootstrapForm();

    // when
    await clickButton('Continue');

    // then
    expect(activePage().querySelector('label').textContent).to.equal('Summary');

    // when
    await clickButton('Back');

    // then
    expect(activePage().querySelector('label').textContent).to.equal('Account type');
  });

  it('should skip a page hidden by condition when navigating', async function () {
    // given
    await bootstrapForm({ data: { accountType: 'business' } });

    // when
    await clickButton('Continue');

    // then
    expect(activePage().querySelector('label').textContent).to.equal('Company details');
  });

  it('should move to the next visible page when the active page hides itself', async function () {
    // given
    await bootstrapForm({ data: { accountType: 'business' } });

    await clickButton('Continue');

    // assume
    expect(activePage().querySelector('label').textContent).to.equal('Company details');

    // when
    await act(() => form._setState({ data: { accountType: 'private' } }));

    // then
    expect(activePage().querySelector('label').textContent).to.equal('Summary');
  });

  it('should fire <multipage.pageChanged>', async function () {
    // given
    await bootstrapForm();

    const events = [];

    form.on('multipage.pageChanged', (event) => events.push(event));

    // when
    await clickButton('Continue');

    // then
    expect(events).to.have.length(1);
    expect(events[0].formField.id).to.equal('Multipage_1');
    expect(events[0].from.id).to.equal('Page_1');
    expect(events[0].to.id).to.equal('Page_3');
  });

  it('should focus the first focusable element of the page', async function () {
    // given
    await bootstrapForm();

    // when
    await clickButton('Continue');

    // then
    expect(document.activeElement).to.equal(activePage().querySelector('input'));
  });

  it('should not focus a page on the initial render', async function () {
    // when
    await bootstrapForm();

    // then
    expect(document.activeElement).to.equal(document.body);
  });

  describe('validation', function () {
    const schema = {
      type: 'default',
      id: 'ValidatedMultiPageForm',
      components: [
        {
          type: 'multipage',
          id: 'Multipage_1',
          components: [
            {
              type: 'page',
              id: 'Page_1',
              label: 'First',
              components: [
                {
                  type: 'textfield',
                  id: 'Textfield_name',
                  key: 'name',
                  label: 'Name',
                  validate: { required: true },
                },
              ],
            },
            {
              type: 'page',
              id: 'Page_2',
              label: 'Second',
              components: [
                {
                  type: 'textfield',
                  id: 'Textfield_nickname',
                  key: 'nickname',
                  label: 'Nickname',
                  validate: { required: true },
                },
              ],
            },
          ],
        },
      ],
    };

    it('should not leave a page with errors', async function () {
      // given
      await bootstrapForm({ schema });

      // when
      await clickButton('Next');

      // then
      expect(activePage().querySelector('label').textContent).to.equal('First');
      expect(activePage().querySelector('.fjs-form-field-error')).to.exist;
    });

    it('should not report errors of pages the user has not reached', async function () {
      // given
      await bootstrapForm({ schema });

      // when
      await clickButton('Next');

      // then
      const pages = Array.from(container.querySelectorAll('.fjs-form-field-page'));
      const second = pages.find((page) => page.querySelector('label').textContent === 'Second');

      expect(second.querySelector('.fjs-form-field-error')).to.not.exist;
    });

    it('should leave a valid page', async function () {
      // given
      await bootstrapForm({ schema });

      await fill('name', 'Igor');

      // when
      await clickButton('Next');

      // then
      expect(activePage().querySelector('label').textContent).to.equal('Second');
    });

    it('should not validate on <back>', async function () {
      // given
      await bootstrapForm({ schema, data: { name: 'Igor' } });

      await clickButton('Next');

      // when
      await clickButton('Back');

      // then
      expect(activePage().querySelector('label').textContent).to.equal('First');
    });
  });

  describe('data', function () {
    it('should keep the values of a page that is no longer on screen', async function () {
      // given
      await bootstrapForm();

      await fill('accountType', 'private');

      // assume
      expect(form.submit().data.accountType).to.equal('private');

      // when
      await clickButton('Continue');
      await fill('comment', 'looks good');

      // then
      // page 1 is mounted but not visible, and still contributes its value
      expect(form.submit().data).to.eql({
        accountType: 'private',
        comment: 'looks good',
      });
    });

    it('should not submit values of a page hidden by condition', async function () {
      // given
      await bootstrapForm({ data: { company: 'ACME' } });

      // when
      const { data } = form.submit();

      // then
      expect(data).to.not.have.property('company');
    });

    it('should submit values of a page revealed by condition', async function () {
      // given
      await bootstrapForm();

      await fill('accountType', 'business');

      // when
      await clickButton('Continue');
      await fill('company', 'ACME');

      // then
      expect(form.submit().data).to.eql({
        accountType: 'business',
        company: 'ACME',
        comment: '',
      });
    });

    it('should survive a round trip', async function () {
      // given
      await bootstrapForm();

      await fill('accountType', 'private');

      // when
      await clickButton('Continue');
      await clickButton('Back');

      // then
      expect(form.submit().data.accountType).to.equal('private');
    });
  });
});
