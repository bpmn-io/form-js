import { render } from '@testing-library/preact/pure';

import Image from '../../../../../src/render/components/form-fields/Image';

import {
  createFormContainer,
  expectNoViolations
} from '../../../../TestHelper';

import { WithFormContext } from './helper';

const IMAGE_DATA_URI = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160px' viewBox='0 0 58 23'%3E%3Cpath fill='currentColor' d='M7.75 3.8v.58c0 1.7-.52 2.78-1.67 3.32C7.46 8.24 8 9.5 8 11.24v1.34c0 2.54-1.35 3.9-3.93 3.9H0V0h3.91c2.68 0 3.84 1.25 3.84 3.8zM2.59 2.35V6.7H3.6c.97 0 1.56-.42 1.56-1.74v-.92c0-1.18-.4-1.7-1.32-1.7zm0 6.7v5.07h1.48c.87 0 1.34-.4 1.34-1.63v-1.43c0-1.53-.5-2-1.67-2H2.6zm14.65-4.98v2.14c0 2.64-1.27 4.08-3.87 4.08h-1.22v6.2H9.56V0h3.82c2.59 0 3.86 1.44 3.86 4.07zm-5.09-1.71v5.57h1.22c.83 0 1.28-.37 1.28-1.55V3.91c0-1.18-.45-1.56-1.28-1.56h-1.22zm11.89 9.34L25.81 0h3.6v16.48h-2.44V4.66l-1.8 11.82h-2.45L20.8 4.83v11.65h-2.26V0h3.6zm9.56-7.15v11.93h-2.33V0h3.25l2.66 9.87V0h2.31v16.48h-2.66zm10.25 9.44v2.5h-2.5v-2.5zM50 4.16C50 1.52 51.38.02 53.93.02c2.54 0 3.93 1.5 3.93 4.14v8.37c0 2.64-1.4 4.14-3.93 4.14-2.55 0-3.93-1.5-3.93-4.14zm2.58 8.53c0 1.18.52 1.63 1.35 1.63.82 0 1.34-.45 1.34-1.63V4c0-1.17-.52-1.62-1.34-1.62-.83 0-1.35.45-1.35 1.62zM0 18.7h57.86V23H0zM45.73 0h2.6v2.58h-2.6zm2.59 16.48V4.16h-2.59v12.32z'%3E%3C/path%3E%3C/svg%3E";
const IMAGE_URL = 'https://example.com/logo.png';
const IMAGE_XSS = 'javascript:throw onerror=alert,\'some string\',123,\'haha\'';

let container;


describe('Image', function() {

  beforeEach(function() {
    container = createFormContainer();
  });

  afterEach(function() {
    container.remove();
  });


  it('should render', function() {

    // when
    const { container } = createImage();

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-image')).to.be.true;

    expect(container.querySelector('img')).to.exist;
  });


  it('should render image (source)', function() {

    // when
    const { container } = createImage({
      field: {
        ...defaultField,
        source: IMAGE_DATA_URI
      }
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    const image = formField.querySelector('.fjs-image');

    expect(image).to.exist;
    expect(image.src).to.eql(IMAGE_DATA_URI);
  });


  it('should render image (expression)', function() {

    // when
    const { container } = createImage({
      data: {
        foo: IMAGE_DATA_URI
      },
      field: {
        ...defaultField,
        source: '=foo'
      },
      evaluateExpression: () => IMAGE_DATA_URI
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    const image = formField.querySelector('.fjs-image');

    expect(image).to.exist;
    expect(image.src).to.eql(IMAGE_DATA_URI);
  });


  it('should render image via link', function() {

    // when
    const { container } = createImage({
      field: {
        ...defaultField,
        source: IMAGE_URL
      }
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    const image = formField.querySelector('.fjs-image');

    expect(image).to.exist;
    expect(image.src).to.eql(IMAGE_URL);
  });



  it('should NOT render image (no source)', function() {

    // when
    const { container } = createImage({
      field: {
        ...defaultField,
        source: null
      }
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    const image = formField.querySelector('.fjs-image');

    expect(image).to.not.exist;
  });


  it('should NOT render image (malformed content)', function() {

    // when
    const { container } = createImage({
      field: {
        ...defaultField,
        source: IMAGE_XSS
      }
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    const image = formField.querySelector('.fjs-image');

    expect(image).to.not.exist;
  });


  it('should render image alt text', function() {

    // when
    const alt = 'foo';

    const { container } = createImage({
      field: {
        ...defaultField,
        alt: alt
      }
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    const image = formField.querySelector('.fjs-image');

    expect(image).to.exist;
    expect(image.alt).to.eql(alt);
  });


  it('should render image alt text (expression)', function() {

    // when
    const alt = 'foo';

    const { container } = createImage({
      data: {
        foo: IMAGE_DATA_URI
      },
      field: {
        ...defaultField,
        alt: '=' + alt
      },
      evaluateExpression: () => alt
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    const image = formField.querySelector('.fjs-image');

    expect(image).to.exist;
    expect(image.alt).to.eql(alt);
  });


  it('#create', function() {

    // assume
    expect(Image.type).to.eql('image');
    expect(Image.label).to.eql('Image view');
    expect(Image.group).to.eql('presentation');
    expect(Image.keyed).to.be.false;

    // when
    const field = Image.create();

    // then
    expect(field).to.exist;

    // but when
    const customField = Image.create({
      custom: true
    });

    // then
    expect(customField).to.contain({
      custom: true
    });
  });


  describe('a11y', function() {

    it('should have no violations', async function() {

      // given
      this.timeout(5000);

      const { container } = createImage();

      // then
      await expectNoViolations(container);
    });

  });

});

// helpers //////////

const defaultField = {
  alt: 'An image',
  source: IMAGE_DATA_URI,
  type: 'image'
};

function createImage(options = {}) {
  const {
    field = defaultField
  } = options;

  return render(WithFormContext(
    <Image
      field={ field } />,
    options
  ), {
    container: options.container || container.querySelector('.fjs-form')
  });
}