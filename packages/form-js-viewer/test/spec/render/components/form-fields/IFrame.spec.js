import { render } from '@testing-library/preact/pure';

import { IFrame } from '../../../../../src/render/components/form-fields/IFrame';

import { SECURITY_ATTRIBUTES_DEFINITIONS } from '../../../../../src';

import {
  createFormContainer,
  expectNoViolations
} from '../../../../TestHelper';

import { MockFormContext } from '../helper';

const IFRAME_URL = 'https://bpmn.io/';

let container;


describe('IFrame', function() {

  beforeEach(function() {
    container = createFormContainer();
  });

  afterEach(function() {
    container.remove();
  });


  it('should render', function() {

    // when
    const { container } = createIFrame();

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-iframe')).to.be.true;

    expect(container.querySelector('iframe')).to.exist;
  });


  it('should render iframe (url)', function() {

    // when
    const { container } = createIFrame();

    // then
    const formField = container.querySelector('.fjs-form-field');

    const iframe = formField.querySelector('.fjs-iframe');

    expect(iframe).to.exist;
    expect(iframe.src).to.eql(IFRAME_URL);
  });


  it('should render iframe (expression)', function() {

    // when
    const { container } = createIFrame({
      initialData: {
        foo: IFRAME_URL
      },
      field: {
        ...defaultField,
        url: '=foo'
      }
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    const iframe = formField.querySelector('.fjs-iframe');

    expect(iframe).to.exist;
    expect(iframe.src).to.eql(IFRAME_URL);
  });


  it('should render iframe (template)', function() {

    // when
    const { container } = createIFrame({
      initialData: {
        foo: IFRAME_URL
      },
      field: {
        ...defaultField,
        source: '{{ foo }}'
      }
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    const iframe = formField.querySelector('.fjs-iframe');

    expect(iframe).to.exist;
    expect(iframe.src).to.eql(IFRAME_URL);
  });


  it('should render placeholder (no url)', function() {

    // when
    const { container } = createIFrame({
      field: {
        ...defaultField,
        url: null
      }
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    const iframe = formField.querySelector('.fjs-iframe');
    const placeholder = formField.querySelector('.fjs-iframe-placeholder');

    expect(iframe).to.not.exist;
    expect(placeholder).to.exist;
  });


  it('should render placeholder (malformed content)', function() {

    // when
    const { container } = createIFrame({
      field: {
        ...defaultField,
        url: 'foo'
      }
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    const iframe = formField.querySelector('.fjs-iframe');
    const placeholder = formField.querySelector('.fjs-iframe-placeholder');

    expect(iframe).to.not.exist;
    expect(placeholder).to.exist;
  });


  it('should render placeholder (http)', function() {

    // when
    const { container } = createIFrame({
      field: {
        ...defaultField,
        url: 'http://example.png'
      }
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    const iframe = formField.querySelector('.fjs-iframe');
    const placeholder = formField.querySelector('.fjs-iframe-placeholder');

    expect(iframe).to.not.exist;
    expect(placeholder).to.exist;
  });


  it('should render iframe title', function() {

    // when
    const label = 'foo';

    const { container } = createIFrame({
      field: {
        ...defaultField,
        label
      }
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    const iframe = formField.querySelector('.fjs-iframe');

    expect(iframe).to.exist;
    expect(iframe.title).to.eql(label);
  });


  it('should set <sandbox> attribute', function() {

    // when
    const { container } = createIFrame();

    // then
    const formField = container.querySelector('.fjs-form-field');

    const iframe = formField.querySelector('.fjs-iframe');

    expect(iframe.sandbox).to.exist;
    expect(iframe.sandbox.item(0)).to.equal('allow-scripts');
  });


  it('should render iframe title (expression)', function() {

    // when
    const label = 'foo';

    const { container } = createIFrame({
      initialData: {
        label
      },
      field: {
        ...defaultField,
        label: '=label'
      }
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    const iframe = formField.querySelector('.fjs-iframe');

    expect(iframe).to.exist;
    expect(iframe.title).to.eql(label);
  });


  it('should render iframe alt text (template)', function() {

    // when
    const label = 'foo';

    const { container } = createIFrame({
      initialData: {
        label
      },
      field: {
        ...defaultField,
        label: '{{ label }}'
      }
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    const iframe = formField.querySelector('.fjs-iframe');

    expect(iframe).to.exist;
    expect(iframe.title).to.eql(label);
  });


  it('#create', function() {

    // assume
    const { config } = IFrame;
    expect(config.type).to.eql('iframe');
    expect(config.label).to.eql('iFrame');
    expect(config.group).to.eql('container');
    expect(config.keyed).to.be.false;

    // when
    const field = config.create();

    // then
    expect(field).to.exist;

    // but when
    const customField = config.create({
      custom: true
    });

    // then
    expect(customField).to.contain({
      custom: true
    });
  });


  describe('security attributes', function() {

    SECURITY_ATTRIBUTES_DEFINITIONS.forEach(definition => {

      const {
        attribute,
        directive,
        property
      } = definition;

      it(`should render ${ property }`, function() {

        // when
        const { container } = createIFrame({
          field: {
            ...defaultField,
            security : {
              [ property ]: true
            }
          }
        });

        // then
        const formField = container.querySelector('.fjs-form-field');
        const iframe = formField.querySelector('.fjs-iframe');

        if (attribute === 'sandbox') {
          expect(iframe.sandbox.item(0)).to.eql(directive);
        } else {
          expect(iframe.allow).to.eql(directive);
        }
      });

    });


    it('should render multiple security attributes', function() {

      // when
      const { container } = createIFrame({
        field: {
          ...defaultField,
          security : {
            allowSameOrigin: true,
            fullscreen: true,
            geolocation: true,
            camera: false,
            microphone: true,
            allowForms: false,
            allowModals: true,
            allowPopups: false,
            allowTopNavigation: true
          }
        }
      });

      // then
      const formField = container.querySelector('.fjs-form-field');
      const iframe = formField.querySelector('.fjs-iframe');

      expect(iframe.sandbox.length).to.eql(3);
      expect(iframe.sandbox.item(0)).to.eql('allow-same-origin');
      expect(iframe.sandbox.item(1)).to.eql('allow-modals');
      expect(iframe.sandbox.item(2)).to.eql('allow-top-navigation');
      expect(iframe.allow).to.eql('fullscreen; geolocation; microphone');
    });

  });


  describe('a11y', function() {

    it('should have no violations', async function() {

      // given
      this.timeout(10000);

      const { container } = createIFrame();

      // then
      await expectNoViolations(container);
    });


    it('should have no violations - security attributes', async function() {

      // given
      this.timeout(5000);

      const { container } = createIFrame({
        field: {
          ...defaultField,
          security : {
            allowSameOrigin: true,
            fullscreen: true,
            geolocation: true,
            camera: true,
            microphone: true,
            allowForms: true,
            allowModals: true,
            allowPopups: true,
            allowTopNavigation: true
          }
        }
      });

      // then
      await expectNoViolations(container);
    });

  });

});

// helpers //////////

const defaultField = {
  label: 'An external document',
  url: IFRAME_URL,
  type: 'iframe',
  security: {
    allowScripts: true
  }
};

function createIFrame({ services, ...restOptions } = {}) {

  const options = {
    domId: 'test-iframe',
    field: defaultField,
    container,
    ...restOptions
  };

  return render(
    <MockFormContext
      services={ services }
      options={ options }>
      <IFrame
        domId={ options.domId }
        field={ options.field } />
    </MockFormContext>, {
      container: options.container || container.querySelector('.fjs-form')
    }
  );
}