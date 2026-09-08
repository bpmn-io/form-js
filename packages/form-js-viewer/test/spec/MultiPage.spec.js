import { expect } from 'chai';
import { act } from '@testing-library/preact/pure';
import userEvent from '@testing-library/user-event';

import { createForm, Form } from '../../src';

import multiPageSchema from './multipage.json';
import trailingPageSchema from './multipage-trailing-page.json';
import gatedSchema from './multipage-gated.json';

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

  it('should stay put when a page hidden underfoot is revealed again', async function () {
    // given
    await bootstrapForm({ data: { accountType: 'business' } });

    await clickButton('Continue');

    await act(() => form._setState({ data: { accountType: 'private' } }));

    // assume
    expect(activePage().querySelector('label').textContent).to.equal('Summary');

    // when
    await act(() => form._setState({ data: { accountType: 'business' } }));

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

  it('should fire <multipage.pageChanged> when a condition moves the user', async function () {
    // given
    await bootstrapForm({ data: { accountType: 'business' } });

    await clickButton('Continue');

    const events = [];

    form.on('multipage.pageChanged', (event) => events.push(event));

    // when
    await act(() => form._setState({ data: { accountType: 'private' } }));

    // then
    expect(events).to.have.length(1);
    expect(events[0].from.id).to.equal('Page_2');
    expect(events[0].to.id).to.equal('Page_3');
  });

  it('should not fire <multipage.pageChanged> for the page shown first', async function () {
    // given
    const events = [];

    form = new Form({ container, debounce: false });

    form.on('multipage.pageChanged', (event) => events.push(event));

    // when
    await act(() => form.importSchema(multiPageSchema));

    // then
    expect(events).to.be.empty;
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

  it('should focus a page a condition mounts on arrival', async function () {
    // given
    const schema = {
      type: 'default',
      id: 'RevealedPageForm',
      components: [
        {
          type: 'multipage',
          id: 'Multipage_1',
          components: [
            {
              type: 'page',
              id: 'Page_1',
              label: 'First',
              conditional: { hide: '=step = "two"' },
              components: [{ type: 'textfield', id: 'Textfield_alpha', key: 'alpha', label: 'Alpha' }],
            },
            {
              type: 'page',
              id: 'Page_2',
              label: 'Second',
              conditional: { hide: '=step != "two"' },
              components: [{ type: 'textfield', id: 'Textfield_beta', key: 'beta', label: 'Beta' }],
            },
          ],
        },
      ],
    };

    await bootstrapForm({ schema });

    // assume
    expect(activePage().querySelector('label').textContent).to.equal('First');

    // when
    // the page in view is hidden and its replacement is mounted in the same render
    await act(() => form._setState({ data: { step: 'two' } }));

    // then
    expect(activePage().querySelector('label').textContent).to.equal('Second');
    expect(document.activeElement).to.equal(container.querySelector('input[id$="beta"]'));
  });

  it('should not focus a page revealed beside the one in view', async function () {
    // given
    await bootstrapForm();

    const input = container.querySelector('input[id$="accountType"]');

    // when
    // Page_2 is revealed, but the user stays on Page_1
    await fill('accountType', 'business');

    // then
    expect(document.activeElement).to.equal(input);
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

  describe('submit', function () {
    const withSubmit = (multipage = {}) => ({
      ...multiPageSchema,
      components: [{ ...multiPageSchema.components[0], showSubmit: true, ...multipage }],
    });

    const navigationLabels = () =>
      Array.from(container.querySelectorAll('.fjs-multipage-navigation button')).map((button) => button.textContent);

    it('should show the submit control on the last visible page only', async function () {
      // given
      await bootstrapForm({ schema: withSubmit() });

      // assume
      expect(navigationLabels()).to.eql(['Continue']);

      // when
      await clickButton('Continue');

      // then
      expect(navigationLabels()).to.eql(['Back', 'Submit']);
    });

    it('should not show a submit control without <showSubmit>', async function () {
      // given
      await bootstrapForm();

      // when
      await clickButton('Continue');

      // then
      expect(navigationLabels()).to.eql(['Back']);
    });

    it('should submit the values of every visible page', async function () {
      // given
      await bootstrapForm({ schema: withSubmit() });

      await fill('accountType', 'private');

      await clickButton('Continue');
      await fill('comment', 'looks good');

      const submissions = [];

      form.on('submit', (event) => submissions.push(event));

      // when
      await clickButton('Submit');

      // then
      expect(submissions).to.have.length(1);
      expect(submissions[0].data).to.eql({
        accountType: 'private',
        comment: 'looks good',
      });
    });

    it('should evaluate <submitLabel> of the page on screen', async function () {
      // given
      const schema = withSubmit({
        components: multiPageSchema.components[0].components.map((page) =>
          page.id === 'Page_3' ? { ...page, submitLabel: 'Send as {{accountType}}' } : page,
        ),
      });

      await bootstrapForm({ schema, data: { accountType: 'private' } });

      // when
      await clickButton('Continue');

      // then
      expect(navigationLabels()).to.eql(['Back', 'Send as private']);
    });

    it('should give way to <next> when a page is revealed behind the last one', async function () {
      // given
      await bootstrapForm({ schema: trailingPageSchema });

      // assume
      expect(navigationLabels()).to.eql(['Submit']);

      // when
      await fill('extra', 'yes');

      // then
      expect(navigationLabels()).to.eql(['Next']);
    });
  });

  describe('failed submission', function () {
    const schema = {
      type: 'default',
      id: 'SubmittedMultiPageForm',
      components: [
        {
          type: 'multipage',
          id: 'Multipage_1',
          showSubmit: true,
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
                  id: 'Textfield_note',
                  key: 'note',
                  label: 'Note',
                  validate: { required: true },
                },
              ],
            },
          ],
        },
      ],
    };

    it('should reveal the first page that holds an error', async function () {
      // given
      await bootstrapForm({ schema, data: { name: 'Igor' } });

      await clickButton('Next');

      // assume
      expect(activePage().querySelector('label').textContent).to.equal('Second');

      await act(() => form._setState({ data: { name: '' } }));

      // when
      await clickButton('Submit');

      // then
      expect(activePage().querySelector('label').textContent).to.equal('First');
      expect(activePage().querySelector('.fjs-form-field-error')).to.exist;
    });

    it('should stay put when the error is on the page on screen', async function () {
      // given
      await bootstrapForm({ schema, data: { name: 'Igor' } });

      await clickButton('Next');

      // when
      await clickButton('Submit');

      // then
      expect(activePage().querySelector('label').textContent).to.equal('Second');
      expect(activePage().querySelector('.fjs-form-field-error')).to.exist;
    });

    it('should stay put when the form is valid', async function () {
      // given
      await bootstrapForm({ schema, data: { name: 'Igor', note: 'all good' } });

      await clickButton('Next');

      // when
      await clickButton('Submit');

      // then
      expect(activePage().querySelector('label').textContent).to.equal('Second');
    });
  });

  describe('disabled navigation', function () {
    const schema = gatedSchema;

    const navigationButton = (label) =>
      Array.from(container.querySelectorAll('.fjs-multipage-navigation button')).find(
        (candidate) => candidate.textContent === label,
      );

    it('should mark <next> as disabled while the page is invalid', async function () {
      // when
      await bootstrapForm({ schema });

      // then
      expect(navigationButton('Next').getAttribute('aria-disabled')).to.equal('true');
    });

    it('should not mark <next> as disabled without <disableInvalidNavigation>', async function () {
      // given
      const ungated = { ...schema, components: [{ ...schema.components[0], disableInvalidNavigation: false }] };

      // when
      await bootstrapForm({ schema: ungated });

      // then
      expect(navigationButton('Next').getAttribute('aria-disabled')).to.not.exist;
    });

    it('should release <next> as soon as the page becomes valid', async function () {
      // given
      await bootstrapForm({ schema });

      // when
      await fill('name', 'Igor');

      // then
      expect(navigationButton('Next').getAttribute('aria-disabled')).to.not.exist;
    });

    it('should keep a blocked control focusable', async function () {
      // given
      await bootstrapForm({ schema });

      const button = navigationButton('Next');

      // when
      button.focus();

      // then
      expect(button.disabled).to.be.false;
      expect(document.activeElement).to.equal(button);
    });

    it('should report the errors of the page when a blocked control is clicked', async function () {
      // given
      await bootstrapForm({ schema });

      // when
      await clickButton('Next');

      // then
      expect(activePage().querySelector('label').textContent).to.equal('First');
      expect(activePage().querySelector('.fjs-form-field-error')).to.exist;
    });

    it('should block the submit control the same way', async function () {
      // given
      await bootstrapForm({ schema, data: { name: 'Igor' } });

      await clickButton('Next');

      const submissions = [];

      form.on('submit', (event) => submissions.push(event));

      // assume
      expect(navigationButton('Submit').getAttribute('aria-disabled')).to.equal('true');

      // when
      await clickButton('Submit');

      // then
      expect(submissions).to.be.empty;
      expect(activePage().querySelector('.fjs-form-field-error')).to.exist;
    });

    it('should submit once the last page is valid', async function () {
      // given
      await bootstrapForm({ schema, data: { name: 'Igor', note: 'all good' } });

      await clickButton('Next');

      const submissions = [];

      form.on('submit', (event) => submissions.push(event));

      // when
      await clickButton('Submit');

      // then
      expect(submissions).to.have.length(1);
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

  describe('nested containers', function () {
    const nestedSchema = {
      type: 'default',
      id: 'NestedMultiPageForm',
      components: [
        {
          type: 'multipage',
          id: 'Outer',
          components: [
            {
              type: 'page',
              id: 'Outer_1',
              label: 'Outer first',
              nextLabel: 'Outer next',
              components: [
                {
                  type: 'multipage',
                  id: 'Inner',
                  components: [
                    {
                      type: 'page',
                      id: 'Inner_1',
                      label: 'Inner first',
                      nextLabel: 'Inner next',
                      components: [
                        {
                          type: 'textfield',
                          id: 'Textfield_first',
                          key: 'first',
                          label: 'First',
                          validate: { required: true },
                        },
                      ],
                    },
                    {
                      type: 'page',
                      id: 'Inner_2',
                      label: 'Inner second',
                      backLabel: 'Inner back',
                      components: [
                        {
                          type: 'textfield',
                          id: 'Textfield_second',
                          key: 'second',
                          label: 'Second',
                          validate: { required: true },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'page',
              id: 'Outer_2',
              label: 'Outer second',
              backLabel: 'Outer back',
              components: [{ type: 'textfield', id: 'Textfield_note', key: 'note', label: 'Note' }],
            },
          ],
        },
      ],
    };

    const visiblePageLabels = () =>
      Array.from(container.querySelectorAll('.fjs-form-field-page'))
        .filter((page) => page.offsetParent !== null)
        .map((page) => page.querySelector('label').textContent);

    it('should not hold the outer page back over a nested page', async function () {
      // given
      await bootstrapForm({ schema: nestedSchema });

      // assume
      expect(visiblePageLabels()).to.eql(['Outer first', 'Inner first']);

      // when
      await clickButton('Outer next');

      // then
      expect(visiblePageLabels()).to.eql(['Outer second']);
    });

    it('should hold the nested page back over its own fields', async function () {
      // given
      await bootstrapForm({ schema: nestedSchema });

      // when
      await clickButton('Inner next');

      // then
      expect(visiblePageLabels()).to.eql(['Outer first', 'Inner first']);
      expect(container.querySelector('.fjs-form-field-error')).to.exist;
    });

    it('should focus a visible element when arriving on a page', async function () {
      // given
      await bootstrapForm({ schema: nestedSchema, data: { first: 'one', second: 'two' } });

      await clickButton('Inner next');
      await clickButton('Outer next');

      // assume
      expect(visiblePageLabels()).to.eql(['Outer second']);

      // when
      await clickButton('Outer back');

      // then
      // the first focusable of <Outer first> sits on the hidden <Inner first>
      expect(document.activeElement).to.equal(container.querySelector('input[id$="second"]'));
    });
  });
});
