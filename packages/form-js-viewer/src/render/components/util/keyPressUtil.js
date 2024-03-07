/**
 *
 * @param {KeyboardEvent} ev
 */
function wrapKeyPressedEvent(ev) {
  const { key, altKey, ctrlKey, metaKey } = ev;
  function fn(name, mods = {}) {
    const _mods = { altKey: mods.altKey || false, ctrlKey: mods.ctrlKey || false, metaKey: mods.metaKey || false };
    return key === name && _mods.altKey === altKey && _mods.ctrlKey === ctrlKey && _mods.metaKey === metaKey;
  }
  return fn;
}

export { wrapKeyPressedEvent };