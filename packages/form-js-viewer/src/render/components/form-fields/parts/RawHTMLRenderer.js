import DOMPurify from 'dompurify';
import { useMemo } from 'preact/hooks';

export const RawHTMLRenderer = ({ html, transform = (html) => html, sanitize = true, sanitizeStyleTags = true }) => {

  const sanitizeHtml = (htmlContent) => {
    if (!sanitize) return htmlContent;
    const config = sanitizeStyleTags ? { FORBID_TAGS: [ 'style' ] } : {};
    return DOMPurify.sanitize(htmlContent, config);
  };

  const sanitizedHtml = sanitizeHtml(html);
  const tranformedHtml = useMemo(() => transform(sanitizedHtml), [ sanitizedHtml, transform ]);

  return <div dangerouslySetInnerHTML={ { __html: tranformedHtml } } />;
};