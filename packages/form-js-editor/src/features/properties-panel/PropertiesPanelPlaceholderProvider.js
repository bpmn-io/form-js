/**
 * Provide placeholders for empty and multiple state.
 */
export const PropertiesPanelPlaceholderProvider = {

  getEmpty: () => {
    return {
      text: 'Select a form field to edit its properties.'
    };
  },

  getMultiple: () => {
    return {
      text: 'Multiple form fields are selected. Select a single form field to edit its properties.'
    };
  }
};