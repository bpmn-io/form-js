import {
  forEach,
  isFunction,
  merge
} from 'min-dash';

import axe from 'axe-core';

import TestContainer from 'mocha-test-container-support';

import Form from '../../src/Form';

let OPTIONS, FORM;

function cleanup() {
  if (!FORM) {
    return;
  }

  FORM.destroy();
}

/**
 * https://www.deque.com/axe/core-documentation/api-documentation/#axe-core-tags
 */
const DEFAULT_AXE_RULES = [
  'best-practice',
  'wcag2a',
  'wcag2aa',
  'cat.semantics',
  'cat.forms'
];

/**
 * Bootstrap the form given the specified options and a number of locals (i.e. services)
 *
 * @example
 *
 * describe(function() {
 *
 *   const mockEvents;
 *
 *   beforeEach(bootstrapForm(function() {
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
export function bootstrapForm(schema, options, locals) {

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


    const mockModule = {};

    forEach(_locals, function(value, key) {
      mockModule[ key ] = [ 'value', value ];
    });

    _options.modules = [].concat(_options.modules || [], [ mockModule ]);

    // remove previous instance
    cleanup();

    FORM = new Form(_options);

    if (schema) {
      return FORM.importSchema(schema).then(function(result) {
        return { error: null, warnings: result.warnings };
      }).catch(function(err) {
        return { error: err, warnings: err.warnings };
      });
    }
  };
}

/**
 * Injects services of an instantiated form into the argument.
 *
 * Use it in conjunction with {@link #bootstrapForm}.
 *
 * @example
 *
 * describe(function() {
 *
 *   const mockEvents;
 *
 *   beforeEach(bootstrapForm(...));
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

    if (!FORM) {
      throw new Error('no bootstraped diagram, ensure you created it via #bootstrapForm');
    }

    return FORM.invoke(fn);
  };
}

export function getForm() {
  return FORM;
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

export async function expectNoViolations(node, options = {}) {
  const {
    runOnly,
    ...rest
  } = options;

  const results = await axe.run(node, {
    runOnly: runOnly || DEFAULT_AXE_RULES,
    ...rest
  });

  expect(results.passes).to.be.not.empty;
  expect(results.violations).to.be.empty;
}