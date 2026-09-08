import { createContext } from 'preact';

/**
 * Shares the navigation state of a multipage container with its pages.
 *
 * @type {import('preact').Context<{ activePageId: string|null, showAllPages: boolean }>}
 */
export const MultiPageContext = createContext({
  activePageId: null,
  showAllPages: true,
});
