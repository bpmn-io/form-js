
export const form = {
  type: 'default',
  components: [
    {
      type: 'group',
      path: 'myGroup',
      isRepeating: true,
      defaultRepetitions: 5,
      allowAddRemove: true,
      disableCollapse: false,
      nonCollapsedItems: 3
    }
  ]
};

export const errors = [
  {
    'instancePath': '/components/0/isRepeating',
    'keyword': 'false schema',
    'message': 'boolean schema is false',
    'params': {},
    'schemaPath': '#/properties/components/items/allOf/1/allOf/15/then/properties/isRepeating/false schema'
  },
  {
    'instancePath': '/components/0/defaultRepetitions',
    'keyword': 'false schema',
    'message': 'boolean schema is false',
    'params': {},
    'schemaPath': '#/properties/components/items/allOf/1/allOf/15/then/properties/defaultRepetitions/false schema'
  },
  {
    'instancePath': '/components/0/allowAddRemove',
    'keyword': 'false schema',
    'message': 'boolean schema is false',
    'params': {},
    'schemaPath': '#/properties/components/items/allOf/1/allOf/15/then/properties/allowAddRemove/false schema'
  },
  {
    'instancePath': '/components/0/disableCollapse',
    'keyword': 'false schema',
    'message': 'boolean schema is false',
    'params': {},
    'schemaPath': '#/properties/components/items/allOf/1/allOf/15/then/properties/disableCollapse/false schema'
  },
  {
    'instancePath': '/components/0/nonCollapsedItems',
    'keyword': 'false schema',
    'message': 'boolean schema is false',
    'params': {},
    'schemaPath': '#/properties/components/items/allOf/1/allOf/15/then/properties/nonCollapsedItems/false schema'
  },
  {
    'instancePath': '/components/0',
    'keyword': 'if',
    'message': 'must match "then" schema',
    'params': {
      'failingKeyword': 'then'
    },
    'schemaPath': '#/properties/components/items/allOf/1/allOf/15/if'
  }
];