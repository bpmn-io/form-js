export default class SelectionBehavior {
  constructor(eventBus, selection) {
    eventBus.on([
      'commandStack.formField.add.postExecuted',
      'commandStack.formField.move.postExecuted'
    ], ({ context }) => {
      const { formField } = context;

      selection.set(formField);
    });

    eventBus.on('commandStack.formField.remove.postExecuted', ({ context }) => {
      const {
        sourceFormField,
        sourceIndex
      } = context;

      const formField = sourceFormField.components[ sourceIndex ] || sourceFormField.components[ sourceIndex - 1 ];

      if (formField) {
        selection.set(formField);
      } else {
        selection.clear();
      }
    });

    eventBus.on('formField.remove', ({ formField }) => {
      if (selection.isSelected(formField)) {
        selection.clear();
      }
    });
  }
}

SelectionBehavior.$inject = [ 'eventBus', 'selection' ];