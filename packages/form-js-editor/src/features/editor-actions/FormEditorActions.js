import EditorActions from 'diagram-js/lib/features/editor-actions/EditorActions';


export default class FormEditorActions extends EditorActions {
  constructor(eventBus, injector) {
    super(eventBus, injector);

    eventBus.on('form.init', () => {
      this._registerDefaultActions(injector);

      eventBus.fire('editorActions.init', {
        editorActions: this
      });
    });
  }

  _registerDefaultActions(injector) {
    const commandStack = injector.get('commandStack', false),
          formFieldRegistry = injector.get('formFieldRegistry', false),
          modeling = injector.get('modeling', false),
          selection = injector.get('selection', false);

    if (commandStack) {

      // @ts-ignore
      this.register('undo', () => {
        commandStack.undo();
      });

      // @ts-ignore
      this.register('redo', () => {
        commandStack.redo();
      });
    }

    if (formFieldRegistry && selection) {

      // @ts-ignore
      this.register('selectFormField', (options = {}) => {
        const { id } = options;

        if (!id) {
          return;
        }

        const formField = formFieldRegistry.get(id);

        if (formField) {
          selection.set(formField);
        }
      });

    }

    if (modeling && selection) {

      // @ts-ignore
      this.register('removeSelection', () => {
        const selectedFormField = selection.get();

        if (!selectedFormField) {
          return;
        }

        const parentField = formFieldRegistry.get(selectedFormField._parent);

        const index = getFormFieldIndex(parentField, selectedFormField);

        modeling.removeFormField(selectedFormField, parentField, index);
      });
    }
  }
}

FormEditorActions.$inject = [
  'eventBus',
  'injector'
];


// helper ////////////

function getFormFieldIndex(parent, formField) {
  let fieldFormIndex = parent.components.length;

  parent.components.forEach(({ id }, index) => {
    if (id === formField.id) {
      fieldFormIndex = index;
    }
  });

  return fieldFormIndex;
}