import {
  FormFieldRegistry as BaseFieldRegistry
} from '@bpmn-io/form-js-viewer';


export default class FormFieldRegistry extends BaseFieldRegistry {

  /**
   * Updates a form fields id.
   *
   * @param {Object} formField
   * @param {string} newId
   */
  updateId(formField, newId) {

    this._validateId(newId);

    this._eventBus.fire('formField.updateId', {
      formField,
      newId: newId
    });

    this.remove(formField);

    formField.id = newId;

    this.add(formField);

    // TODO(nikku): make this a proper object graph so we
    // do not have to deal with IDs this way...
    if ('components' in formField) {
      for (const component of formField.components) {
        component._parent = newId;
      }
    }

  }


  /**
   * Validate the suitability of the given id and signals a problem
   * with an exception.
   *
   * @param {string} id
   *
   * @throws {Error} if id is empty or already assigned
   */
  _validateId(id) {
    if (!id) {
      throw new Error('formField must have an id');
    }

    if (this.get(id)) {
      throw new Error('formField with id ' + id + ' already added');
    }
  }

}