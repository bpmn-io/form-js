import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

const INITIAL_PAGES = 2;

/**
 * Starts a new multipage container with pages, as an empty container has
 * nothing to navigate between and pages are not offered on their own.
 *
 * The pages are added within the command that adds the container, so that a
 * single undo removes all of them.
 */
export class MultiPageBehavior extends CommandInterceptor {
  constructor(eventBus, modeling) {
    super(eventBus);

    // run ahead of the selection, so that the container ends up selected
    // rather than the last page added to it
    this.postExecute(
      'formField.add',
      1500,
      function (context) {
        const { formField } = context;

        if (formField.type !== 'multipage' || (formField.components && formField.components.length)) {
          return;
        }

        for (let index = 0; index < INITIAL_PAGES; index++) {
          modeling.addFormField({ type: 'page', label: `Page ${index + 1}` }, formField, index);
        }
      },
      true,
    );
  }
}

MultiPageBehavior.$inject = ['eventBus', 'modeling'];
