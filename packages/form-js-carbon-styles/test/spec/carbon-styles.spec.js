import 'preact/debug';

import { ThemeProvider } from 'styled-components';

import { Form } from '@bpmn-io/form-js-viewer';

import {
  render,
  waitFor
} from '@testing-library/preact/pure';

import {
  useEffect,
  useRef
} from 'preact/hooks';

import {
  query as domQuery
} from 'min-dom';

import { GlobalFormStyling } from '../../src/carbon-styles';

import { g10, g100 } from '@carbon/elements';

import {
  expectNoViolations,
  insertCSS,
  isSingleStart
} from '../TestHelper';

import schema from './complex.json';

import formCSS from '@bpmn-io/form-js-viewer/dist/assets/form-js-base.css';

import themeCSS from './theme.scss';

import testCSS from '../test.css';

import carbonSassStyles from '../../src/carbon-styles.scss';

const THEME_TOKENS = {
  light: 'g10',
  dark: 'g100',
};
const themes = {
  [THEME_TOKENS.light]: {
    ...g10
  },
  [THEME_TOKENS.dark]: {
    ...g100
  },
};

insertCSS('test.css', testCSS);
insertCSS('theme.css', themeCSS);
insertCSS('form-js.css', formCSS);

const singleStart = isSingleStart('carbon-form');


describe('Carbon styles', function() {

  let container;

  beforeEach(function() {
    container = document.createElement('div');
    container.classList.add('cds--g100');

    document.body.appendChild(container);
  });

  !singleStart && afterEach(function() {
    document.body.removeChild(container);
  });


  it('should render - styled-components (legacy)', function() {

    // given
    const toggle = document.createElement('button');
    toggle.textContent = 'Toggle Theme';
    toggle.style.position = 'absolute';
    toggle.style.right = '10px';
    toggle.style.top = '10px';
    container.appendChild(toggle);

    let theme = 'dark';

    const data = {
      creditor: 'John Doe Company',
      amount: 456,
      invoiceNumber: 'C-123',
      approved: true,
      approvedBy: 'John Doe',
      mailto: [ 'regional-manager', 'approver' ],
      product: 'camunda-cloud',
      queriedDRIs: [
        {
          'label': 'John Doe',
          'value': 'johnDoe'
        },
        {
          'label': 'Anna Bell',
          'value': 'annaBell'
        },
        {
          'label': 'Nico Togin',
          'value': 'incognito'
        }
      ],
      tags: [ 'tag1', 'tag2', 'tag3' ],
      readonly_tags: [ 'tag1', 'tag2', 'tag3' ],
      readonly_checklist: [ 'option_1' ],
      readonly_radio: 'option_1',
      language: 'english'
    };

    const result = createFormView({
      container,
      schema,
      data
    });

    toggle.addEventListener('click', () => {
      toggleTheme(container);
      theme = theme === 'dark' ? 'light' : 'dark';
      createFormView({
        theme,
        container,
        schema,
        data
      }, result.rerender);
    });

    // then
    expect(domQuery('.fjs-container', result.container)).to.exist;
  });


  (singleStart ? it.only : it)('should render - sass', function() {

    // given
    insertCSS('carbon-styles.css', carbonSassStyles);

    const toggle = document.createElement('button');
    toggle.textContent = 'Toggle Theme';
    toggle.style.position = 'absolute';
    toggle.style.right = '10px';
    toggle.style.top = '10px';
    container.appendChild(toggle);

    let theme = 'dark';

    const data = {
      creditor: 'John Doe Company',
      amount: 456,
      invoiceNumber: 'C-123',
      approved: true,
      approvedBy: 'John Doe',
      mailto: [ 'regional-manager', 'approver' ],
      product: 'camunda-cloud',
      queriedDRIs: [
        {
          'label': 'John Doe',
          'value': 'johnDoe'
        },
        {
          'label': 'Anna Bell',
          'value': 'annaBell'
        },
        {
          'label': 'Nico Togin',
          'value': 'incognito'
        }
      ],
      tags: [ 'tag1', 'tag2', 'tag3' ],
      readonly_tags: [ 'tag1', 'tag2', 'tag3' ],
      readonly_checklist: [ 'option_1' ],
      readonly_radio: 'option_1',
      language: 'english',
      tableSource: [
        {
          id: '1',
          name: 'John Doe',
          age: 30
        },
        {
          id: '2',
          name: 'Anna Bell',
          age: 25

        },
        {
          id: '3',
          name: 'Nico Togin',
          age: 40
        }
      ]
    };

    const result = createFormView({
      container,
      schema,
      data,
      withGlobalFormStyling: false
    });

    toggle.addEventListener('click', () => {
      toggleTheme(container);
      theme = theme === 'dark' ? 'light' : 'dark';
      createFormView({
        theme,
        container,
        schema,
        data,
        withGlobalFormStyling: false
      }, result.rerender);
    });

    // then
    expect(domQuery('.fjs-container', result.container)).to.exist;
  });


  describe('a11y', function() {

    it('should have no violations', async function() {

      // given
      this.timeout(10000);

      const data = {};

      let node;

      await waitFor(() => {
        const result = createFormView({ data, schema, container });

        node = result.container;
      });

      // then
      // @Note(pinussilvestrus): we disable color-contrast rule as it is a basic Carbon issue
      await expectNoViolations(node, {
        rules: {
          'color-contrast': { enabled: false }
        }
      });
    });

  });

});


// helper //////////////

function createFormView(options = {}, renderFn = render) {
  const {
    container,
    theme = 'dark',
    withGlobalFormStyling = true,
    ...restOptions
  } = options;

  return renderFn(
    <WithTheme theme={ themes[THEME_TOKENS[theme]] }>
      { withGlobalFormStyling && <GlobalFormStyling></GlobalFormStyling> }
      <FormContainer { ...restOptions }></FormContainer>
    </WithTheme>,
    {
      container
    }
  );
}

function FormContainer(props) {

  const ref = useRef(null);

  useEffect(() => {
    async function importSchema(schema, data) {
      return await form.importSchema(schema, data);
    }

    const form = new Form({
      container: ref.current,
      schema
    });

    importSchema (props.schema, props.data);

    return () => { form.destroy(); };
  }, [ ref, props ]);

  return <div ref={ ref } class="form-container cds--layer-one"></div>;
}


function WithTheme(props) {
  const { theme } = props;

  if (!theme) {
    return props.children;
  }

  return <ThemeProvider theme={ theme }>{ props.children }</ThemeProvider>;
}

function toggleTheme(node) {
  node.classList.toggle('cds--g100');
  node.classList.toggle('cds--g10');
}