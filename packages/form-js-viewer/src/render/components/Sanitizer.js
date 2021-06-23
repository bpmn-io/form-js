const NODE_TYPE_TEXT = 3,
      NODE_TYPE_ELEMENT = 1;

const DISALLOWED_NODES = [
  'embed',
  'iframe',
  'object',
  'script',
  'svg'
];

const ALLOWED_ATTRIBUTES = [
  'align',
  'alt',
  'class',
  'href',
  'id',
  'name',
  'src',
  'valign'
];

// See https://github.com/developit/snarkdown/issues/70
export function sanitizeHTML(html) {
  const doc = new DOMParser().parseFromString(
    `<!DOCTYPE html>\n<html><body><div>${ html }`,
    'text/html'
  );

  doc.normalize();

  sanitize(doc.body);

  return new XMLSerializer().serializeToString(doc.body.firstChild);
}

function sanitize(node) {
  if (node.nodeType === NODE_TYPE_TEXT) {
    return;
  }

  if (node.nodeType !== NODE_TYPE_ELEMENT || DISALLOWED_NODES.includes(node.tagName.toLowerCase())) {
    return node.remove();
  }

  for (let i = node.attributes.length; i--;) {
    const name = node.attributes[ i ].name;

    if (!ALLOWED_ATTRIBUTES.includes(name.toLowerCase())) {
      node.attributes.removeNamedItem(name);
    }

    if (name === 'href') {
      const href = node.attributes.getNamedItem('href');

      if (href.value.replace(/\n/g, '').includes('javascript:')) {
        node.attributes.removeNamedItem('href');
      }
    }
  }

  for (let i = node.childNodes.length; i--;) {
    sanitize(node.childNodes[ i ]);
  }
}