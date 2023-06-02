import { useContext, useMemo } from 'preact/hooks';

import A11yErrors from '../A11yErrors';

import { FormContext } from '../../context';

import { useExpressionEvaluation } from '../../hooks';
import { sanitizeImageSource } from '../Sanitizer';

import {
  formFieldClasses,
  prefixId
} from '../Util';

import ImagePlaceholder from './icons/ImagePlaceholder.svg';

const type = 'image';


export default function Image(props) {
  const {
    field,
    a11yErrors = []
  } = props;

  const {
    alt,
    id,
    source
  } = field;


  const evaluatedImageSource = useExpressionEvaluation(source);

  const safeSource = useMemo(() => sanitizeImageSource(evaluatedImageSource), [ evaluatedImageSource ]);

  const altText = useExpressionEvaluation(alt);

  const { formId } = useContext(FormContext);

  const a11yErrorMessageId = a11yErrors.length === 0 ? undefined : `${prefixId(id, formId)}-a11y-error-message`;

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
    <A11yErrors id={ a11yErrorMessageId } a11yErrors={ a11yErrors } />
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
