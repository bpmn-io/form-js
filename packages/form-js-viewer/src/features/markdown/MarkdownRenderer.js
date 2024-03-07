import { marked } from 'marked';

marked.setOptions({
  gfm: true
});

export class MarkdownRenderer {

  /**
   * Render markdown to HTML.
   *
   * @param {string} markdown - The markdown to render
   *
   * @returns {string} HTML
   */
  render(markdown) {

    // @ts-expect-error
    return marked.parse(markdown);
  }
}

MarkdownRenderer.$inject = [];