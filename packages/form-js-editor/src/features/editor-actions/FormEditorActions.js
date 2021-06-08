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
    const commandStack = injector.get('commandStack', false);

    if (commandStack) {

      // @ts-ignore
      this.register('undo', function() {
        commandStack.undo();
      });

      // @ts-ignore
      this.register('redo', function() {
        commandStack.redo();
      });
    }
  }
}

FormEditorActions.$inject = [
  'eventBus',
  'injector'
];