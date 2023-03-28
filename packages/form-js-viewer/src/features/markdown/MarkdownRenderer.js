import showdown from 'showdown';

// bootstrap showdown to support github flavored markdown
showdown.setFlavor('github');

export default class MarkdownRenderer {

  constructor() {
    this._converter = new showdown.Converter();
  }

  /**
   * Render markdown to HTML.
   *
   * @param {string} markdown - The markdown to render
   *
   * @returns {string} HTML
   */
  render(markdown) {
    return this._converter.makeHtml(markdown);
  }
}

MarkdownRenderer.$inject = [];