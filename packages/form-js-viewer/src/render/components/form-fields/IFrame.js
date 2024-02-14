import { useEffect, useMemo, useState } from 'preact/hooks';

import { useSingleLineTemplateEvaluation, useSecurityAttributesMap } from '../../hooks';
import { sanitizeIFrameSource } from '../util/sanitizerUtil';

import { Label } from '../Label';

import { formFieldClasses } from '../Util';


const type = 'iframe';

const DEFAULT_HEIGHT = 300;


export function IFrame(props) {
  const {
    field,
    disabled,
    readonly,
    domId
  } = props;

  const {
    height = DEFAULT_HEIGHT,
    label,
    url,
    security = {}
  } = field;

  const evaluatedUrl = useSingleLineTemplateEvaluation(url, { debug: true });

  const safeUrl = useMemo(() => sanitizeIFrameSource(evaluatedUrl), [ evaluatedUrl ]);

  const evaluatedLabel = useSingleLineTemplateEvaluation(label, { debug: true });

  const [ sandbox, allow ] = useSecurityAttributesMap(security);
  const [ iframeRefresh, setIframeRefresh ] = useState(0);

  // forces re-render of iframe when sandbox or allow attributes change, as browsers do not do it automatically
  useEffect(() => {
    setIframeRefresh(count => count + 1);
  }, [ sandbox, allow ]);

  return <div class={ formFieldClasses(type, { disabled, readonly }) }>
    <Label htmlFor={ domId } label={ evaluatedLabel } />
    {
      !evaluatedUrl && <IFramePlaceholder text="No content to show." />
    }
    {
      evaluatedUrl && safeUrl &&
        <iframe
          src={ safeUrl }
          title={ evaluatedLabel }
          height={ height }
          class="fjs-iframe"
          id={ domId }
          sandbox={ sandbox }
          key={ 'iframe-' + iframeRefresh }

          /* @Note: JSX HTML attributes do not include <allow> */
          { ...{ allow } }
        />
    }
    {
      evaluatedUrl && !safeUrl && <IFramePlaceholder text="External content couldn't be loaded." />
    }
  </div>;
}

function IFramePlaceholder(props) {
  const { text = 'iFrame' } = props;

  return <div class="fjs-iframe-placeholder">
    <p class="fjs-iframe-placeholder-text">{ text }</p>
  </div>;
}

IFrame.config = {
  type,
  keyed: false,
  label: 'iFrame',
  group: 'container',
  create: (options = {}) => ({
    security: {
      allowScripts: true
    },
    ...options
  })
};
