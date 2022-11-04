import { useContext } from 'preact/hooks';

import { FormContext } from '../../context';

import { useImageSource } from '../../hooks/useImageSource';

import {
  formFieldClasses,
  prefixId,
  safeImageSource
} from '../Util';

import ImagePlaceholder from './icons/ImagePlaceholder.svg';

const type = 'image';


export default function Image(props) {
  const {
    field
  } = props;

  const {
    alt,
    id
  } = field;

  const { source } = useImageSource(field);
  const safeSource = safeImageSource(source);

  const { formId } = useContext(FormContext);

  return <div class={ formFieldClasses(type) }>
    <div class="fjs-image-container">
      {
        safeSource &&
        <img
          alt={ alt }
          src={ safeSource }
          class="fjs-image"
          id={ prefixId(id, formId) } />
      }
      { !safeSource &&
        <div class="fjs-image-placeholder">
          <ImagePlaceholder alt="This is an image placeholder" />
        </div>
      }
    </div>
  </div>;
}

Image.create = function(options = {}) {
  return {
    ...options
  };
};

Image.type = type;
Image.keyed = false;