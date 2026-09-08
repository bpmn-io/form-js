/**
 * Report why a field of the given type may not be placed inside a parent of the
 * given type, or nothing if the placement is fine.
 *
 * @param { string } type
 * @param { string } parentType
 * @returns { string | undefined }
 */
export function validateNesting(type, parentType) {
  if (type === 'page' && parentType !== 'multipage') {
    return 'Pages can only be placed inside a multi page container';
  }

  if (type !== 'page' && parentType === 'multipage') {
    return 'Multi page containers can only hold pages';
  }
}
