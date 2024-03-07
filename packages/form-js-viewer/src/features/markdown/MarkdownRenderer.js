import { marked } from 'marked';

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
    return marked.parse(markdown, {
      gfm: true,
      breaks: true
    });
  }
}

MarkdownRenderer.$inject = [];