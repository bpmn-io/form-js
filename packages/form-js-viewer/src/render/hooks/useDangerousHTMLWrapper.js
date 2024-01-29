import { useMemo } from 'preact/hooks';
import DOMPurify from 'dompurify';


/**
 * Wrap HTML content in a configuration object for dangerouslySetInnerHTML
 * @param {Object} props
 * @param {string} props.html
 * @param {Function} [props.transform]
 * @param {boolean} [props.sanitize = true]
 * @param {boolean} [props.sanitizeStyleTags = true]
 */
const useDangerousHTMLWrapper = (props) => {

  const {
    html,
    transform = (html) => html,
    sanitize = true,
    sanitizeStyleTags = true
  } = props;

  const sanitizedHtml = useMemo(() => sanitize ? DOMPurify.sanitize(html, getDOMPurifyConfig(sanitizeStyleTags)) : html, [ html, sanitize, sanitizeStyleTags ]);
  const transformedHtml = useMemo(() => transform(sanitizedHtml), [ sanitizedHtml, transform ]);

  // Return the configuration object for dangerouslySetInnerHTML
  return { __html: transformedHtml };
};

const getDOMPurifyConfig = (sanitizeStyleTags) => {
  return {
    FORCE_BODY: true,
    FORBID_TAGS: (sanitizeStyleTags ? [ 'style' ] : [])
  };
};

export { useDangerousHTMLWrapper };
