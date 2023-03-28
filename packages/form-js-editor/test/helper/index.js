import {
  forEach,
  isFunction,
  merge
} from 'min-dash';

import { act } from 'preact/test-utils';

import TestContainer from 'mocha-test-container-support';

import FormEditor from '../../src/FormEditor';

let OPTIONS, FORM_EDITOR;

function cleanup() {
  if (!FORM_EDITOR) {
    return;
  }

  FORM_EDITOR.destroy();
}

/**
 * Bootstrap the form editor given the specified options and a number of locals (i.e. services)
 *
 * @example
 *
 * describe(function() {
 *
 *   const mockEvents;
 *
 *   beforeEach(bootstrapFormEditor(function() {
 *     mockEvents = new Events();
 *
 *     return {
 *       events: mockEvents
 *     };
 *   }));
 *
 * });
 *
 * @param  {Object} schema
 * @param  {Object} [options]
 * @param  {Object|Function} locals
 *
 * @returns {Promise}
 */
export function bootstrapFormEditor(schema, options, locals) {

  return function() {

    let testContainer;

    // Make sure the test container is an optional dependency and we fall back
    // to an empty <div> if it does not exist.
    //
    // This is needed if other libraries rely on this helper for testing
    // while not adding the mocha-test-container-support as a dependency.
    try {
      testContainer = TestContainer.get(this);
    } catch (e) {
      testContainer = document.createElement('div');
      testContainer.classList.add('test-content-container');

      document.body.appendChild(testContainer);
    }

    let _options = options,
        _locals = locals;

    if (!_locals && isFunction(_options)) {
      _locals = _options;
      _options = null;
    }

    if (isFunction(_options)) {
      _options = _options();
    }

    if (isFunction(_locals)) {
      _locals = _locals();
    }

    _options = merge({
      renderer: {
        container: testContainer
      }
    }, OPTIONS, _options);

    if (_locals) {
      const mockModule = {};

      forEach(_locals, function(value, key) {
        mockModule[ key ] = [ 'value', value ];
      });

      _options.modules = [].concat(_options.modules || [], [ mockModule ]);
    }

    // remove previous instance
    cleanup();

    FORM_EDITOR = new FormEditor(_options);

    if (schema) {
      return FORM_EDITOR.importSchema(schema).then(function(result) {
        return { error: null, warnings: result.warnings };
      }).catch(function(err) {
        console.error('#bootstrapFormEditor failed', err, err.warnings);

        return Promise.reject(err);
      });
    }
  };
}

/**
 * Injects services of an instantiated form editor into the argument.
 *
 * Use it in conjunction with {@link #bootstrapFormEditor}.
 *
 * @example
 *
 * describe(function() {
 *
 *   const mockEvents;
 *
 *   beforeEach(bootstrapFormEditor(...));
 *
 *   it('should provide mocked events', inject(function(events) {
 *     expect(events).toBe(mockEvents);
 *   }));
 *
 * });
 *
 * @param  {Function} fn the function to inject to
 * @return {Function} a function that can be passed to it to carry out the injection
 */
export function inject(fn) {
  return function() {

    if (!FORM_EDITOR) {
      throw new Error('no bootstraped diagram, ensure you created it via #bootstrapFormEditor');
    }

    return FORM_EDITOR.invoke(fn);
  };
}

export function getFormEditor() {
  return FORM_EDITOR;
}

export function insertCSS(name, css) {
  if (document.querySelector('[data-css-file="' + name + '"]')) {
    return;
  }

  const head = document.head || document.getElementsByTagName('head')[ 0 ];

  const style = document.createElement('style');

  style.setAttribute('data-css-file', name);

  style.type = 'text/css';

  style.appendChild(document.createTextNode(css));

  head.appendChild(style);
}

export async function setEditorValue(editor, value) {
  await act(() => {
    editor.textContent = value;
  });

  // Requires 2 ticks to propagate the change to form editor
  await act(() => {});
}

export { expectNoViolations } from '../../../form-js-viewer/test/helper';
