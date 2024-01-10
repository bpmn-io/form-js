import { updateRow } from './cmd/Util';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { clone } from '@bpmn-io/form-js-viewer';


export class FormLayoutUpdater extends CommandInterceptor {

  constructor(eventBus, formLayouter, modeling, formEditor) {
    super(eventBus);

    this._eventBus = eventBus;
    this._formLayouter = formLayouter;
    this._modeling = modeling;
    this._formEditor = formEditor;

    // @ts-ignore
    this.preExecute([
      'formField.add',
      'formField.remove',
      'formField.move',
      'id.updateClaim'
    ], (event) => this.updateRowIds(event));

    // we need that as the state got updates
    // on the next tick (not in post execute)
    eventBus.on('changed', (context) => {
      const { schema } = context;
      this.updateLayout(schema);
    });

  }

  updateLayout(schema) {
    this._formLayouter.clear();
    this._formLayouter.calculateLayout(clone(schema));
  }

  updateRowIds(event) {

    const { schema } = this._formEditor._getState();

    const setRowIds = parent => {
      if (!parent.components || !parent.components.length) {
        return;
      }

      parent.components.forEach(formField => {
        const row = this._formLayouter.getRowForField(formField);

        updateRow(formField, row.id);

        // handle children recursively
        setRowIds(formField);
      });
    };

    // make sure rows are persisted in schema (e.g. for migration case)
    setRowIds(schema);
  }

}

FormLayoutUpdater.$inject = [ 'eventBus', 'formLayouter', 'modeling', 'formEditor' ];