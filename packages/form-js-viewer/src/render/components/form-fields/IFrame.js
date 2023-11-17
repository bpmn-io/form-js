import { useContext, useMemo } from 'preact/hooks';

import { FormContext } from '../../context';

import { useSingleLineTemplateEvaluation } from '../../hooks';
import { sanitizeIFrameSource } from '../Sanitizer';

import Label from '../Label';

import {
  formFieldClasses,
  prefixId
} from '../Util';

import { iconsByType } from '../icons';
const type = 'iframe';

const DEFAULT_HEIGHT = 300;


export default function IFrame(props) {
  const {
    field,
    disabled,
    readonly
  } = props;

  const {
    height = DEFAULT_HEIGHT,
    id,
    label,
    url
  } = field;

  const evaluatedUrl = useSingleLineTemplateEvaluation(url, { debug: true });

  const safeUrl = useMemo(() => sanitizeIFrameSource(evaluatedUrl), [ evaluatedUrl ]);

  const evaluatedLabel = useSingleLineTemplateEvaluation(label, { debug: true });

  const { formId } = useContext(FormContext);

  return <div class={ formFieldClasses(type, { disabled, readonly }) }>
    <Label id={ prefixId(id, formId) } label={ evaluatedLabel } />
    {
      safeUrl &&
        <iframe
          src={ safeUrl }
          title={ evaluatedLabel }
          height={ height }
          class="fjs-iframe"
          id={ prefixId(id, formId) }
        />
    }
    {
      !safeUrl && <IFramePlaceholder />
    }
  </div>;
}

function IFramePlaceholder() {
  const Icon = iconsByType(type);

  return <div class="fjs-iframe-placeholder">
    <p class="fjs-iframe-placeholder-text"><Icon width="32" height="24" viewBox="0 0 56 56" />iFrame</p>
  </div>;
}

IFrame.config = {
  type,
  keyed: false,
  label: 'iFrame',
  group: 'container',
  create: (options = {}) => ({
    ...options
  })
};
