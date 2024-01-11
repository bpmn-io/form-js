import { getAncestryList } from '../util';

export class FieldFactory {

  /**
   * @constructor
   *
   * @param  formFieldRegistry
   * @param  formFields
   */
  constructor(formFieldRegistry, pathRegistry, formFields) {
    this._formFieldRegistry = formFieldRegistry;
    this._pathRegistry = pathRegistry;
    this._formFields = formFields;
  }

  create(attrs, applyDefaults = true) {

    const {
      id,
      type,
      key,
      path,
      _parent
    } = attrs;

    const fieldDefinition = this._formFields.get(type);

    if (!fieldDefinition) {
      throw new Error(`form field of type <${ type }> not supported`);
    }

    const { config } = fieldDefinition;

    if (!config) {
      throw new Error(`form field of type <${ type }> has no config`);
    }

    if (id && this._formFieldRegistry._ids.assigned(id)) {
      throw new Error(`form field with id <${ id }> already exists`);
    }

    // ensure that we can claim the path

    const parent = _parent && this._formFieldRegistry.get(_parent);
    const parentPath = parent && this._pathRegistry.getValuePath(parent) || [];
    const knownAncestorIds = getAncestryList(_parent, this._formFieldRegistry);

    if (config.keyed && key && !this._pathRegistry.canClaimPath([ ...parentPath, ...key.split('.') ],
      {
        isClosed: true,
        knownAncestorIds
      })
    ) {
      throw new Error(`binding path '${ [ ...parentPath, key ].join('.') }' is already claimed`);
    }

    if (config.pathed && path && !this._pathRegistry.canClaimPath([ ...parentPath, ...path.split('.') ],
      {
        isRepeatable: config.repeatable,
        knownAncestorIds
      })
    ) {
      throw new Error(`binding path '${ [ ...parentPath, ...path.split('.') ].join('.') }' is already claimed`);
    }

    const labelAttrs = applyDefaults && config.label ? {
      label: config.label
    } : {};

    const field = config.create({
      ...labelAttrs,
      ...attrs
    });

    this._ensureId(field);

    if (config.keyed) {
      this._ensureKey(field);
      this._pathRegistry.claimPath(this._pathRegistry.getValuePath(field), { isClosed: true, claimerId: field.id, knownAncestorIds: getAncestryList(_parent, this._formFieldRegistry) });
    }

    if (config.pathed) {
      if (config.repeatable) {
        this._enforceDefaultPath(field);
      }

      if (field.path) {
        this._pathRegistry.claimPath(this._pathRegistry.getValuePath(field), { isRepeatable: config.repeatable, claimerId: field.id, knownAncestorIds: getAncestryList(_parent, this._formFieldRegistry) });
      }
    }

    return field;
  }

  _ensureId(field) {

    if (field.id) {
      this._formFieldRegistry._ids.claim(field.id, field);

      return;
    }

    let prefix = 'Field';

    if (field.type === 'default') {
      prefix = 'Form';
    }

    field.id = this._formFieldRegistry._ids.nextPrefixed(`${prefix}_`, field);
  }

  _ensureKey(field) {
    if (!field.key) {
      field.key = this._getUniqueKeyPath(field);
    }
  }

  _enforceDefaultPath(field) {
    if (!field.path) {
      field.path = this._getUniqueKeyPath(field);
    }
  }

  _getUniqueKeyPath(field) {

    let random;
    const parent = this._formFieldRegistry.get(field._parent);

    // ensure key uniqueness at level
    do {
      random = Math.random().toString(36).substring(7);
    } while (parent && parent.components.some(child => child.key === random));

    return `${field.type}_${random}`;
  }

}


FieldFactory.$inject = [
  'formFieldRegistry',
  'pathRegistry',
  'formFields'
];