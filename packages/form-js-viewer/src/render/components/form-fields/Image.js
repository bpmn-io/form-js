import { useContext, useMemo } from 'preact/hooks';

import { FormContext } from '../../context';

import { useSingleLineTemplateEvaluation } from '../../hooks';
import { sanitizeImageSource } from '../Sanitizer';

import {
  formFieldClasses,
  prefixId
} from '../Util';

import ImagePlaceholder from './icons/ImagePlaceholder.svg';

const type = 'image';


export function Image(props) {
  const {
    field
  } = props;

  const {
    alt,
    id,
    source
  } = field;

  const evaluatedImageSource = useSingleLineTemplateEvaluation(source, { debug: true });

  const safeSource = useMemo(() => sanitizeImageSource(evaluatedImageSource), [ evaluatedImageSource ]);

  const altText = useSingleLineTemplateEvaluation(alt, { debug: true });

  const { formId } = useContext(FormContext);

  return <div class={ formFieldClasses(type) }>
    <div class="fjs-image-container">
      {
        safeSource &&
        <img
          alt={ altText }
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

Image.config = {
  type,
  keyed: false,
  label: 'Image view',
  group: 'presentation',
  create: (options = {}) => ({
    ...options
  })
};
