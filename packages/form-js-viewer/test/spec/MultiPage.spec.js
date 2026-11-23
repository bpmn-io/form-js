import { expect } from 'chai';
import { act } from '@testing-library/preact/pure';
import userEvent from '@testing-library/user-event';
import * as sinon from 'sinon';

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

  // the container of multipage.json, hidden while <state> is set
  const hideableSchema = {
    ...multiPageSchema,
    components: [{ ...multiPageSchema.components[0], conditional: { hide: '=state != null' } }],
  };

  const validatedSchema = {
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
    expect(activePage().querySelector('.fjs-page-title').textContent).to.equal('Account type');
  });

  it('should hide a page by condition', async function () {
    // when
    await bootstrapForm();

    // then
    // Page_2 is hidden while the account type is not "business"
    const labels = Array.from(container.querySelectorAll('.fjs-form-field-page > .fjs-page-title')).map(
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
    const labels = Array.from(container.querySelectorAll('.fjs-form-field-page > .fjs-page-title')).map(
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

  describe('navigation labels', function () {
    const withLabels = (multipage = {}) => ({
      ...multiPageSchema,
      components: [{ ...multiPageSchema.components[0], showSubmit: true, ...multipage }],
    });

    const navigationLabels = () =>
      Array.from(container.querySelectorAll('.fjs-multipage-navigation button')).map((button) => button.textContent);

    it('should use the labels of the container when the page has none', async function () {
      // given
      await bootstrapForm({
        schema: withLabels({ backLabel: 'Previous', nextLabel: 'Onward', submitLabel: 'Send' }),
      });

      // when
      await clickButton('Continue');

      // then
      expect(navigationLabels()).to.eql(['Previous', 'Send']);
    });

    it('should prefer the labels of the page over those of the container', async function () {
      // when
      await bootstrapForm({ schema: withLabels({ nextLabel: 'Onward' }) });

      // then
      expect(navigationLabels()).to.eql(['Continue']);
    });

    it('should use the container label on a page without its own', async function () {
      // given
      await bootstrapForm({
        schema: withLabels({ nextLabel: 'Onward' }),
        data: { accountType: 'business' },
      });

      // when
      await clickButton('Continue');

      // then
      expect(navigationLabels()).to.eql(['Change account type', 'Onward']);
    });

    it('should fall back to the translated defaults', async function () {
      // given
      await bootstrapForm({ schema: withLabels() });

      // when
      await clickButton('Continue');

      // then
      expect(navigationLabels()).to.eql(['Back', 'Submit']);
    });
  });

  it('should navigate forwards and backwards', async function () {
    // given
    await bootstrapForm();

    // when
    await clickButton('Continue');

    // then
    expect(activePage().querySelector('.fjs-page-title').textContent).to.equal('Summary');

    // when
    await clickButton('Back');

    // then
    expect(activePage().querySelector('.fjs-page-title').textContent).to.equal('Account type');
  });

  it('should skip a page hidden by condition when navigating', async function () {
    // given
    await bootstrapForm({ data: { accountType: 'business' } });

    // when
    await clickButton('Continue');

    // then
    expect(activePage().querySelector('.fjs-page-title').textContent).to.equal('Company details');
  });

  it('should move to the next visible page when the active page hides itself', async function () {
    // given
    await bootstrapForm({ data: { accountType: 'business' } });

    await clickButton('Continue');

    // assume
    expect(activePage().querySelector('.fjs-page-title').textContent).to.equal('Company details');

    // when
    await act(() => form._setState({ data: { accountType: 'private' } }));

    // then
    expect(activePage().querySelector('.fjs-page-title').textContent).to.equal('Summary');
  });

  it('should move to the next visible page when the active page hides itself by its own field', async function () {
    // given
    const schema = {
      type: 'default',
      id: 'SelfHidingPageForm',
      components: [
        {
          type: 'multipage',
          id: 'Multipage_1',
          components: [
            {
              type: 'page',
              id: 'Page_1',
              label: 'Account type',
              conditional: { hide: '=accountType = "private"' },
              components: [{ type: 'textfield', id: 'Textfield_accountType', key: 'accountType' }],
            },
            {
              type: 'page',
              id: 'Page_2',
              label: 'Summary',
              components: [{ type: 'textfield', id: 'Textfield_comment', key: 'comment' }],
            },
          ],
        },
      ],
    };

    await bootstrapForm({ schema });

    // assume
    expect(activePage().querySelector('.fjs-page-title').textContent).to.equal('Account type');

    // when
    await fill('accountType', 'private');

    // then
    expect(activePage().querySelector('.fjs-page-title').textContent).to.equal('Summary');
  });

  it('should stay put when a page hidden underfoot is revealed again', async function () {
    // given
    await bootstrapForm({ data: { accountType: 'business' } });

    await clickButton('Continue');

    await act(() => form._setState({ data: { accountType: 'private' } }));

    // assume
    expect(activePage().querySelector('.fjs-page-title').textContent).to.equal('Summary');

    // when
    await act(() => form._setState({ data: { accountType: 'business' } }));

    // then
    expect(activePage().querySelector('.fjs-page-title').textContent).to.equal('Summary');
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

  it('should fire <multipage.pageChanged> for the page shown first', async function () {
    // given
    const events = [];

    form = new Form({ container, debounce: false });

    form.on('multipage.pageChanged', (event) => events.push(event));

    // when
    await act(() => form.importSchema(multiPageSchema));

    // then
    expect(events).to.have.length(1);
    expect(events[0].formField.id).to.equal('Multipage_1');
    expect(events[0].from).to.be.null;
    expect(events[0].to.id).to.equal('Page_1');
  });

  it('should not fire <multipage.pageChanged> when a hidden container is revealed again', async function () {
    // given
    await bootstrapForm({ schema: hideableSchema });

    await clickButton('Continue');

    await act(() => form._setState({ data: { ...form._getState().data, state: 'away' } }));

    const events = [];

    form.on('multipage.pageChanged', (event) => events.push(event));

    // when
    await act(() => form._setState({ data: { ...form._getState().data, state: null } }));

    // then
    expect(events).to.be.empty;
  });

  it('should fire <multipage.pageChanged> for the page shown first of a hidden container', async function () {
    // given
    const events = [];

    form = new Form({ container, debounce: false });

    form.on('multipage.pageChanged', (event) => events.push(event));

    // when
    await act(() => form.importSchema(hideableSchema, { state: 'away' }));

    // then
    expect(container.querySelector('.fjs-form-field-multipage')).to.not.exist;

    expect(events).to.have.length(1);
    expect(events[0].formField.id).to.equal('Multipage_1');
    expect(events[0].from).to.be.null;
    expect(events[0].to.id).to.equal('Page_1');
    expect(form.get('multiPageNavigation').getActivePage('Multipage_1')).to.equal('Page_1');
  });

  it('should fire <multipage.pageChanged> for the page shown first after reset', async function () {
    // given
    await bootstrapForm();

    await clickButton('Continue');

    const events = [];

    form.on('multipage.pageChanged', (event) => events.push(event));

    // when
    await act(() => form.reset());

    // then
    expect(events).to.have.length(1);
    expect(events[0].formField.id).to.equal('Multipage_1');
    expect(events[0].from).to.be.null;
    expect(events[0].to.id).to.equal('Page_1');
  });

  it('should commit a move a condition forces on a hidden container', async function () {
    // given
    await bootstrapForm({ schema: hideableSchema, data: { accountType: 'business' } });

    await clickButton('Continue');

    await act(() => form._setState({ data: { ...form._getState().data, state: 'away' } }));

    const events = [];

    form.on('multipage.pageChanged', (event) => events.push(event));

    // when
    await act(() => form._setState({ data: { ...form._getState().data, accountType: 'private' } }));

    // then
    expect(container.querySelector('.fjs-form-field-multipage')).to.not.exist;

    expect(form.get('multiPageNavigation').getActivePage('Multipage_1')).to.equal('Page_3');

    expect(events).to.have.length(1);
    expect(events[0].from.id).to.equal('Page_2');
    expect(events[0].to.id).to.equal('Page_3');
  });

  it('should focus the title of the page', async function () {
    // given
    await bootstrapForm();

    // when
    await clickButton('Continue');

    // then
    expect(document.activeElement).to.equal(activePage().querySelector('.fjs-page-title'));
  });

  it('should focus a page without title', async function () {
    // given
    // a page imported without label gets a default one, so clear it explicitly
    const schema = {
      ...multiPageSchema,
      components: [
        {
          ...multiPageSchema.components[0],
          components: multiPageSchema.components[0].components.map((page) =>
            page.id === 'Page_3' ? { ...page, label: '' } : page,
          ),
        },
      ],
    };

    await bootstrapForm({ schema });

    // when
    await clickButton('Continue');

    // then
    expect(activePage().querySelector('.fjs-page-title')).not.to.exist;
    expect(activePage().hasAttribute('aria-labelledby')).to.be.false;
    expect(document.activeElement).to.equal(activePage());
  });

  it('should not open a select on arrival', async function () {
    // given
    const schema = {
      type: 'default',
      id: 'SelectPageForm',
      components: [
        {
          type: 'multipage',
          id: 'Multipage_1',
          components: [
            {
              type: 'page',
              id: 'Page_1',
              label: 'First',
              components: [{ type: 'textfield', id: 'Textfield_alpha', key: 'alpha', label: 'Alpha' }],
            },
            {
              type: 'page',
              id: 'Page_2',
              label: 'Second',
              components: [
                {
                  type: 'select',
                  id: 'Select_language',
                  key: 'language',
                  label: 'Language',
                  values: [
                    { label: 'English', value: 'english' },
                    { label: 'German', value: 'german' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    await bootstrapForm({ schema });

    // when
    await clickButton('Next');

    // then
    expect(activePage().querySelector('.fjs-page-title').textContent).to.equal('Second');
    expect(container.querySelector('.fjs-dropdownlist')).not.to.exist;
  });

  it('should not open a date picker on arrival', async function () {
    // given
    const schema = {
      type: 'default',
      id: 'DatePageForm',
      components: [
        {
          type: 'multipage',
          id: 'Multipage_1',
          components: [
            {
              type: 'page',
              id: 'Page_1',
              label: 'First',
              components: [{ type: 'textfield', id: 'Textfield_alpha', key: 'alpha', label: 'Alpha' }],
            },
            {
              type: 'page',
              id: 'Page_2',
              label: 'Second',
              components: [
                {
                  type: 'datetime',
                  id: 'Datetime_date',
                  key: 'date',
                  subtype: 'date',
                  dateLabel: 'Date',
                },
              ],
            },
          ],
        },
      ],
    };

    await bootstrapForm({ schema });

    // when
    await clickButton('Next');

    // then
    expect(activePage().querySelector('.fjs-page-title').textContent).to.equal('Second');
    expect(document.querySelector('.flatpickr-calendar.open')).not.to.exist;

    // and when
    // the user focuses the field
    await act(() => activePage().querySelector('input').focus());

    // then
    // the calendar this test looks for does open
    expect(document.querySelector('.flatpickr-calendar.open')).to.exist;
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
    expect(activePage().querySelector('.fjs-page-title').textContent).to.equal('First');

    // when
    // the page in view is hidden and its replacement is mounted in the same render
    await act(() => form._setState({ data: { step: 'two' } }));

    // then
    expect(activePage().querySelector('.fjs-page-title').textContent).to.equal('Second');
    expect(document.activeElement).to.equal(activePage().querySelector('.fjs-page-title'));
  });

  it('should focus a page revealed after every page was hidden', async function () {
    // given
    const schema = {
      type: 'default',
      id: 'EmptiedMultiPageForm',
      components: [
        {
          type: 'multipage',
          id: 'Multipage_1',
          components: [
            {
              type: 'page',
              id: 'Page_1',
              label: 'First',
              conditional: { hide: '=step = "none" or step = "two"' },
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

    await act(() => form._setState({ data: { step: 'none' } }));

    // assume
    expect(activePage()).not.to.exist;

    // when
    await act(() => form._setState({ data: { step: 'two' } }));

    // then
    expect(activePage().querySelector('.fjs-page-title').textContent).to.equal('Second');
    expect(document.activeElement).to.equal(activePage().querySelector('.fjs-page-title'));
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

  describe('navigation service', function () {
    const navigation = () => form.get('multiPageNavigation');

    const activeLabel = () => activePage().querySelector('.fjs-page-title').textContent;

    it('should report the page shown first', async function () {
      // when
      await bootstrapForm();

      // then
      expect(navigation().getActivePage('Multipage_1')).to.equal('Page_1');
    });

    it('should report the page the user navigated to', async function () {
      // given
      await bootstrapForm();

      // when
      await clickButton('Continue');

      // then
      expect(navigation().getActivePage('Multipage_1')).to.equal('Page_3');
    });

    it('should report null for an unknown container', async function () {
      // given
      await bootstrapForm();

      // then
      expect(navigation().getActivePage('Unknown')).to.be.null;
      expect(navigation().getActivePage('Page_1')).to.be.null;
    });

    it('should navigate to a page', async function () {
      // given
      await bootstrapForm();

      // when
      let result;

      await act(() => {
        result = navigation().navigate('Multipage_1', 'Page_3');
      });

      // then
      expect(result).to.be.true;
      expect(activeLabel()).to.equal('Summary');
      expect(navigation().getActivePage('Multipage_1')).to.equal('Page_3');
    });

    it('should fire <multipage.pageChanged> on navigation', async function () {
      // given
      await bootstrapForm();

      const events = [];

      form.on('multipage.pageChanged', (event) => events.push(event));

      // when
      await act(() => navigation().navigate('Multipage_1', 'Page_3'));

      // then
      expect(events).to.have.length(1);
      expect(events[0].formField.id).to.equal('Multipage_1');
      expect(events[0].from.id).to.equal('Page_1');
      expect(events[0].to.id).to.equal('Page_3');
    });

    it('should not fire <multipage.pageChanged> when staying on the page shown', async function () {
      // given
      await bootstrapForm();

      const events = [];

      form.on('multipage.pageChanged', (event) => events.push(event));

      // when
      const result = navigation().navigate('Multipage_1', 'Page_1');

      // then
      expect(result).to.be.true;
      expect(events).to.be.empty;
    });

    it('should not navigate to a page hidden by condition', async function () {
      // given
      await bootstrapForm();

      // when
      const result = navigation().navigate('Multipage_1', 'Page_2');

      // then
      expect(result).to.be.false;
      expect(navigation().getActivePage('Multipage_1')).to.equal('Page_1');
    });

    it('should not navigate to a page of another container', async function () {
      // given
      await bootstrapForm();

      // then
      expect(navigation().navigate('Multipage_1', 'Textfield_comment')).to.be.false;
      expect(navigation().navigate('Unknown', 'Page_3')).to.be.false;
    });

    it('should navigate away from a page with errors by default', async function () {
      // given
      await bootstrapForm({ schema: validatedSchema });

      // when
      let result;

      await act(() => {
        result = navigation().navigate('Multipage_1', 'Page_2');
      });

      // then
      expect(result).to.be.true;
      expect(activeLabel()).to.equal('Second');
    });

    it('should not navigate away from a page with errors with <validate>', async function () {
      // given
      await bootstrapForm({ schema: validatedSchema });

      // when
      let result;

      await act(() => {
        result = navigation().navigate('Multipage_1', 'Page_2', { validate: true });
      });

      // then
      expect(result).to.be.false;
      expect(activeLabel()).to.equal('First');
      expect(activePage().querySelector('.fjs-form-field-error')).to.exist;
    });

    it('should navigate away from a valid page with <validate>', async function () {
      // given
      await bootstrapForm({ schema: validatedSchema, data: { name: 'Igor' } });

      // when
      let result;

      await act(() => {
        result = navigation().navigate('Multipage_1', 'Page_2', { validate: true });
      });

      // then
      expect(result).to.be.true;
      expect(activeLabel()).to.equal('Second');
    });

    it('should keep the page of a container while it is hidden', async function () {
      // given
      await bootstrapForm({ schema: hideableSchema });

      await clickButton('Continue');

      // when
      await act(() => form._setState({ data: { ...form._getState().data, state: 'away' } }));
      await act(() => form._setState({ data: { ...form._getState().data, state: null } }));

      // then
      expect(activeLabel()).to.equal('Summary');
    });

    it('should navigate a hidden container', async function () {
      // given
      await bootstrapForm({ schema: hideableSchema, data: { state: 'away' } });

      // assume
      expect(container.querySelector('.fjs-form-field-multipage')).to.not.exist;

      // when
      const result = navigation().navigate('Multipage_1', 'Page_3');

      await act(() => form._setState({ data: { ...form._getState().data, state: null } }));

      // then
      expect(result).to.be.true;
      expect(activeLabel()).to.equal('Summary');
    });

    it('should start over on reset', async function () {
      // given
      await bootstrapForm();

      await clickButton('Continue');

      // when
      await act(() => form.reset());

      // then
      expect(activeLabel()).to.equal('Account type');
      expect(navigation().getActivePage('Multipage_1')).to.equal('Page_1');
    });

    it('should start over on import', async function () {
      // given
      await bootstrapForm();

      await clickButton('Continue');

      // when
      await act(() => form.importSchema(multiPageSchema));

      // then
      expect(activeLabel()).to.equal('Account type');
    });

    it('should restore a page after import', async function () {
      // given
      await bootstrapForm();

      await clickButton('Continue');

      const pageId = navigation().getActivePage('Multipage_1');

      // when
      await act(async () => {
        await form.importSchema(multiPageSchema);

        navigation().navigate('Multipage_1', pageId);
      });

      // then
      expect(activeLabel()).to.equal('Summary');
    });

    it('should navigate between a render and its effects', async function () {
      // given
      await bootstrapForm({ schema: hideableSchema, data: { state: 'away' } });

      // when
      // reveal the container and let it render, but not yet run its effects
      form._setState({ data: { ...form._getState().data, state: null } });

      await new Promise((resolve) => setTimeout(resolve));

      // assume
      expect(container.querySelector('.fjs-form-field-multipage')).to.exist;

      navigation().navigate('Multipage_1', 'Page_3');

      await act(() => new Promise((resolve) => setTimeout(resolve, 200)));

      // then
      expect(navigation().getActivePage('Multipage_1')).to.equal('Page_3');
      expect(activeLabel()).to.equal('Summary');
    });

    describe('#getState', function () {
      it('should report the page shown first', async function () {
        // when
        await bootstrapForm();

        // then
        expect(navigation().getState('Multipage_1')).to.eql({
          activePageId: 'Page_1',
          visiblePageIds: ['Page_1', 'Page_3'],
          index: 0,
          isFirst: true,
          isLast: false,
        });
      });

      it('should report the page the user navigated to', async function () {
        // given
        await bootstrapForm({ data: { accountType: 'business' } });

        // when
        await clickButton('Continue');

        // then
        expect(navigation().getState('Multipage_1')).to.eql({
          activePageId: 'Page_2',
          visiblePageIds: ['Page_1', 'Page_2', 'Page_3'],
          index: 1,
          isFirst: false,
          isLast: false,
        });
      });

      it('should leave out a page hidden by condition', async function () {
        // when
        await bootstrapForm({ data: { accountType: 'private' } });

        // then
        expect(navigation().getState('Multipage_1').visiblePageIds).to.eql(['Page_1', 'Page_3']);
      });

      it('should report the last page', async function () {
        // given
        await bootstrapForm();

        // when
        await clickButton('Continue');

        // then
        expect(navigation().getState('Multipage_1')).to.eql({
          activePageId: 'Page_3',
          visiblePageIds: ['Page_1', 'Page_3'],
          index: 1,
          isFirst: false,
          isLast: true,
        });
      });

      it('should report null for an unknown container', async function () {
        // given
        await bootstrapForm();

        // then
        expect(navigation().getState('Unknown')).to.be.null;
        expect(navigation().getState('Page_1')).to.be.null;
      });
    });

    describe('#next', function () {
      it('should move to the next page in view', async function () {
        // given
        await bootstrapForm();

        // when
        let result;

        await act(() => {
          result = navigation().next('Multipage_1');
        });

        // then
        expect(result).to.be.true;
        expect(activeLabel()).to.equal('Summary');
        expect(navigation().getActivePage('Multipage_1')).to.equal('Page_3');
      });

      it('should not move on from the last page', async function () {
        // given
        await bootstrapForm();

        await clickButton('Continue');

        // when
        const result = navigation().next('Multipage_1');

        // then
        expect(result).to.be.false;
        expect(navigation().getActivePage('Multipage_1')).to.equal('Page_3');
      });

      it('should not move on from a page with errors', async function () {
        // given
        await bootstrapForm({ schema: validatedSchema });

        // when
        let result;

        await act(() => {
          result = navigation().next('Multipage_1');
        });

        // then
        expect(result).to.be.false;
        expect(activeLabel()).to.equal('First');
        expect(activePage().querySelector('.fjs-form-field-error')).to.exist;
      });

      it('should move on from a page with errors without <validate>', async function () {
        // given
        await bootstrapForm({ schema: validatedSchema });

        // when
        let result;

        await act(() => {
          result = navigation().next('Multipage_1', { validate: false });
        });

        // then
        expect(result).to.be.true;
        expect(activeLabel()).to.equal('Second');
      });

      it('should not move an unknown container', async function () {
        // given
        await bootstrapForm();

        // then
        expect(navigation().next('Unknown')).to.be.false;
      });
    });

    describe('#back', function () {
      it('should move to the previous page in view', async function () {
        // given
        await bootstrapForm();

        await clickButton('Continue');

        // when
        let result;

        await act(() => {
          result = navigation().back('Multipage_1');
        });

        // then
        expect(result).to.be.true;
        expect(activeLabel()).to.equal('Account type');
        expect(navigation().getActivePage('Multipage_1')).to.equal('Page_1');
      });

      it('should not move back from the first page', async function () {
        // given
        await bootstrapForm();

        // when
        const result = navigation().back('Multipage_1');

        // then
        expect(result).to.be.false;
        expect(navigation().getActivePage('Multipage_1')).to.equal('Page_1');
      });
    });

    describe('<multipage.pageChange>', function () {
      it('should fire before <multipage.pageChanged>', async function () {
        // given
        await bootstrapForm();

        const events = [];

        form.on('multipage.pageChange', (event) => events.push(['pageChange', event]));
        form.on('multipage.pageChanged', (event) => events.push(['pageChanged', event]));

        // when
        await act(() => navigation().navigate('Multipage_1', 'Page_3'));

        // then
        expect(events.map(([type]) => type)).to.eql(['pageChange', 'pageChanged']);

        const [, event] = events[0];

        expect(event.formField.id).to.equal('Multipage_1');
        expect(event.from.id).to.equal('Page_1');
        expect(event.to.id).to.equal('Page_3');
      });

      it('should keep the page when a listener returns false', async function () {
        // given
        await bootstrapForm();

        const changed = [];

        form.on('multipage.pageChange', () => false);
        form.on('multipage.pageChanged', (event) => changed.push(event));

        // when
        let result;

        await act(() => {
          result = navigation().navigate('Multipage_1', 'Page_3');
        });

        // then
        expect(result).to.be.false;
        expect(navigation().getActivePage('Multipage_1')).to.equal('Page_1');
        expect(activeLabel()).to.equal('Account type');
        expect(changed).to.be.empty;
      });

      it('should keep the page on a click when a listener returns false', async function () {
        // given
        await bootstrapForm();

        form.on('multipage.pageChange', () => false);

        // when
        await clickButton('Continue');

        // then
        expect(navigation().getActivePage('Multipage_1')).to.equal('Page_1');
        expect(activeLabel()).to.equal('Account type');
      });

      it('should not fire for the page shown first', async function () {
        // given
        const events = [];

        form = new Form({ container, debounce: false });

        form.on('multipage.pageChange', (event) => events.push(event));

        // when
        await act(() => form.importSchema(multiPageSchema));

        // then
        expect(events).to.be.empty;
      });

      it('should not fire when a condition moves the user', async function () {
        // given
        await bootstrapForm({ data: { accountType: 'business' } });

        await clickButton('Continue');

        const events = [];

        form.on('multipage.pageChange', (event) => events.push(event));

        // when
        await act(() => form._setState({ data: { accountType: 'private' } }));

        // then
        expect(events).to.be.empty;
        expect(navigation().getActivePage('Multipage_1')).to.equal('Page_3');
      });
    });
  });

  describe('enter key', function () {
    const schema = {
      ...validatedSchema,
      components: [
        ...validatedSchema.components,
        { type: 'button', id: 'Button_submit', action: 'submit', label: 'Send' },
      ],
    };

    const activeTitle = () => activePage().querySelector('.fjs-page-title').textContent;

    it('should move to the next page', async function () {
      // given
      await bootstrapForm({ schema });

      const submitSpy = sinon.spy();

      form.on('submit', submitSpy);

      // when
      await fill('name', 'x{enter}');

      // then
      expect(activeTitle()).to.equal('Second');
      expect(submitSpy).not.to.have.been.called;
      expect(container.querySelector('.fjs-form-field-error')).not.to.exist;
    });

    it('should not move on from a page with errors', async function () {
      // given
      await bootstrapForm({ schema });

      const submitSpy = sinon.spy();

      form.on('submit', submitSpy);

      // when
      await fill('name', '{enter}');

      // then
      expect(activeTitle()).to.equal('First');
      expect(activePage().querySelector('.fjs-form-field-textfield .fjs-form-field-error')).to.exist;
      expect(submitSpy).not.to.have.been.called;
    });

    it('should submit on the last page', async function () {
      // given
      await bootstrapForm({ schema, data: { name: 'Igor' } });

      await clickButton('Next');

      const submitSpy = sinon.spy();

      form.on('submit', submitSpy);

      // assume
      expect(activeTitle()).to.equal('Second');

      // when
      await fill('nickname', 'y{enter}');

      // then
      expect(submitSpy).to.have.been.calledOnce;
      expect(submitSpy.args[0][0].errors).to.eql({});
    });

    it('should stay on the page when the key picks a time', async function () {
      // given
      const timeSchema = {
        type: 'default',
        id: 'TimePageForm',
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
                    type: 'datetime',
                    id: 'Datetime_time',
                    key: 'time',
                    subtype: 'time',
                    timeLabel: 'Time',
                    timeInterval: 15,
                  },
                ],
              },
              {
                type: 'page',
                id: 'Page_2',
                label: 'Second',
                components: [{ type: 'textfield', id: 'Textfield_beta', key: 'beta', label: 'Beta' }],
              },
            ],
          },
        ],
      };

      await bootstrapForm({ schema: timeSchema });

      const input = activePage().querySelector('input');

      // the dropdown opens on focus
      await act(() => userEvent.click(input));

      // assume
      expect(container.querySelector('.fjs-dropdownlist')).to.exist;

      // when
      // enter picks the option the dropdown offers
      await act(() => userEvent.keyboard('{enter}'));

      // then
      expect(activeTitle()).to.equal('First');
      expect(form._getState().data.time).to.exist;
    });
  });

  describe('validation', function () {
    const schema = validatedSchema;

    it('should not leave a page with errors', async function () {
      // given
      await bootstrapForm({ schema });

      // when
      await clickButton('Next');

      // then
      expect(activePage().querySelector('.fjs-page-title').textContent).to.equal('First');
      expect(activePage().querySelector('.fjs-form-field-error')).to.exist;
    });

    it('should not report errors of pages the user has not reached', async function () {
      // given
      await bootstrapForm({ schema });

      // when
      await clickButton('Next');

      // then
      const pages = Array.from(container.querySelectorAll('.fjs-form-field-page'));
      const second = pages.find((page) => page.querySelector('.fjs-page-title').textContent === 'Second');

      expect(second.querySelector('.fjs-form-field-error')).to.not.exist;
    });

    it('should leave a valid page', async function () {
      // given
      await bootstrapForm({ schema });

      await fill('name', 'Igor');

      // when
      await clickButton('Next');

      // then
      expect(activePage().querySelector('.fjs-page-title').textContent).to.equal('Second');
    });

    it('should not validate on <back>', async function () {
      // given
      await bootstrapForm({ schema, data: { name: 'Igor' } });

      await clickButton('Next');

      // when
      await clickButton('Back');

      // then
      expect(activePage().querySelector('.fjs-page-title').textContent).to.equal('First');
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
      expect(activePage().querySelector('.fjs-page-title').textContent).to.equal('Second');

      await act(() => form._setState({ data: { name: '' } }));

      // when
      await clickButton('Submit');

      // then
      expect(activePage().querySelector('.fjs-page-title').textContent).to.equal('First');
      expect(activePage().querySelector('.fjs-form-field-error')).to.exist;
    });

    it('should stay put when the error is on the page on screen', async function () {
      // given
      await bootstrapForm({ schema, data: { name: 'Igor' } });

      await clickButton('Next');

      // when
      await clickButton('Submit');

      // then
      expect(activePage().querySelector('.fjs-page-title').textContent).to.equal('Second');
      expect(activePage().querySelector('.fjs-form-field-error')).to.exist;
    });

    it('should stay put when the form is valid', async function () {
      // given
      await bootstrapForm({ schema, data: { name: 'Igor', note: 'all good' } });

      await clickButton('Next');

      // when
      await clickButton('Submit');

      // then
      expect(activePage().querySelector('.fjs-page-title').textContent).to.equal('Second');
    });
  });

  describe('read-only form', function () {
    const navigationButton = (label) =>
      Array.from(container.querySelectorAll('.fjs-multipage-navigation button')).find(
        (candidate) => candidate.textContent === label,
      );

    it('should navigate forwards and backwards', async function () {
      // given
      await bootstrapForm({ properties: { readOnly: true } });

      // when
      await clickButton('Continue');

      // then
      expect(activePage().querySelector('.fjs-page-title').textContent).to.equal('Summary');

      // when
      await clickButton('Back');

      // then
      expect(activePage().querySelector('.fjs-page-title').textContent).to.equal('Account type');
    });

    it('should leave an invalid page without reporting its errors', async function () {
      // given
      await bootstrapForm({ schema: gatedSchema, properties: { readOnly: true } });

      // when
      await clickButton('Next');

      // then
      expect(activePage().querySelector('.fjs-page-title').textContent).to.equal('Second');
      expect(container.querySelector('.fjs-form-field-error')).to.not.exist;
    });

    it('should disable the submit control', async function () {
      // given
      await bootstrapForm({ schema: gatedSchema, data: { name: 'Igor' }, properties: { readOnly: true } });

      // when
      await clickButton('Next');

      // then
      expect(navigationButton('Back').disabled).to.be.false;
      expect(navigationButton('Submit').disabled).to.be.true;
    });
  });

  describe('disabled form', function () {
    const navigationButton = (label) =>
      Array.from(container.querySelectorAll('.fjs-multipage-navigation button')).find(
        (candidate) => candidate.textContent === label,
      );

    it('should disable <back> and <next>', async function () {
      // given
      await bootstrapForm({ schema: validatedSchema, properties: { disabled: true } });

      const multiPageNavigation = form.get('multiPageNavigation');

      // when
      await act(() => multiPageNavigation.navigate('Multipage_1', 'Page_2'));

      // then
      expect(navigationButton('Back').disabled).to.be.true;

      // when
      await act(() => multiPageNavigation.navigate('Multipage_1', 'Page_1'));

      // then
      expect(navigationButton('Next').disabled).to.be.true;
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

    it('should announce the values of a page hidden by condition as removed', async function () {
      // given
      await bootstrapForm({ data: { accountType: 'business' } });

      const removed = [];

      form.on('conditionChecker.remove', ({ item }) => removed.push(item));

      // when
      await act(() => form._setState({ data: { accountType: 'private', company: 'ACME', comment: '' } }));

      // then
      expect(removed).to.deep.include({ company: 'ACME' });
    });

    it('should drop the files of a page hidden by condition', async function () {
      // given
      const schema = {
        type: 'default',
        id: 'MultiPageFileForm',
        components: [
          {
            type: 'multipage',
            id: 'Multipage_1',
            components: [
              {
                type: 'page',
                id: 'Page_1',
                label: 'Account type',
                components: [{ type: 'textfield', id: 'Textfield_accountType', key: 'accountType' }],
              },
              {
                type: 'page',
                id: 'Page_2',
                label: 'Company details',
                conditional: { hide: '=accountType != "business"' },
                components: [{ type: 'filepicker', id: 'Filepicker_contract', key: 'contract' }],
              },
            ],
          },
        ],
      };

      await bootstrapForm({ schema, data: { accountType: 'business' } });

      const fileRegistry = form.get('fileRegistry');

      fileRegistry.setFiles('files::Filepicker_contract', [new File([''], 'contract.pdf')]);

      // when
      await act(() => form._setState({ data: { accountType: 'private', contract: 'files::Filepicker_contract' } }));

      // then
      expect(fileRegistry.hasKey('files::Filepicker_contract')).to.be.false;
    });
  });
});
