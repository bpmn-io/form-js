import Palette from './components/Palette';

import {
  render
} from 'preact';

import {
  domify,
  query as domQuery
} from 'min-dom';


/**
 * @typedef { { parent: Element } } PaletteConfig
 * @typedef { import('../../core/EventBus').default } EventBus
 */

/**
 * @param {PaletteConfig} paletteConfig
 * @param {EventBus} eventBus
 */
export default class PaletteRenderer {

  constructor(paletteConfig, eventBus) {
    const {
      parent
    } = paletteConfig || {};

    this._eventBus = eventBus;

    this._container = domify('<div class="fjs-palette-container"></div>');

    if (parent) {
      this.attachTo(parent);
    }

    this._eventBus.once('formEditor.rendered', 500, () => {
      this._render();
    });
  }


  /**
   * Attach the palette to a parent node.
   *
   * @param {HTMLElement} container
   */
  attachTo(container) {
    if (!container) {
      throw new Error('container required');
    }

    if (typeof container === 'string') {
      container = domQuery(container);
    }

    // (1) detach from old parent
    this.detach();

    // (2) append to parent container
    container.appendChild(this._container);

    // (3) notify interested parties
    this._eventBus.fire('palette.attach');
  }

  /**
   * Detach the palette from its parent node.
   */
  detach() {
    const parentNode = this._container.parentNode;

    if (parentNode) {
      parentNode.removeChild(this._container);

      this._eventBus.fire('palette.detach');
    }
  }

  _render() {
    render(
      <Palette />,
      this._container
    );

    this._eventBus.fire('palette.rendered');
  }

  _destroy() {
    if (this._container) {
      render(null, this._container);

      this._eventBus.fire('palette.destroyed');
    }
  }
}

PaletteRenderer.$inject = [ 'config.palette', 'eventBus' ];