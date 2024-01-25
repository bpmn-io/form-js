import { useContext, useMemo } from 'preact/hooks';

import { FormContext } from '../../context';

import { iconsByType } from '../icons';

import { useSingleLineTemplateEvaluation } from '../../hooks';
import { sanitizeImageSource } from '../util/sanitizerUtil';

import {
  formFieldClasses,
  prefixId
} from '../Util';

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

  const Icon = iconsByType(field.type);

  const evaluatedImageSource = useSingleLineTemplateEvaluation(source, { debug: true });

  const safeSource = useMemo(() => sanitizeImageSource(evaluatedImageSource), [ evaluatedImageSource ]);

  const altText = useSingleLineTemplateEvaluation(alt, { debug: true });

  const { formId } = useContext(FormContext);

  return <div class={ formFieldClasses(type) }>
    {
      safeSource && <div class="fjs-image-container">
        <img
          alt={ altText }
          src={ safeSource }
          class="fjs-image"
          id={ prefixId(id, formId) } />
      </div>
    }
    {
      !safeSource && <div class="fjs-image-placeholder">
        <span class="fjs-image-placeholder-inner">
          <Icon alt="This is an image placeholder" width="32" height="32" viewBox="0 0 56 56" />
        </span>
      </div>
    }
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
