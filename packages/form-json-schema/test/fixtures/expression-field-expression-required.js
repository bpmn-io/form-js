export const form = {
  type: 'default',
  'components': [
    {
      type: 'expression',
      key: 'expressionField'
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/0/allOf/2/then/required',
    keyword: 'required',
    params: {
      missingProperty: 'expression'
    },
    message: "must have required property 'expression'"
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/0/allOf/2/then/required',
    keyword: 'required',
    params: {
      missingProperty: 'computeOn'
    },
    message: "must have required property 'computeOn'"
  },
  {
    instancePath: '/components/0',
    keyword: 'if',
    message: 'must match "then" schema',
    params: {
      'failingKeyword': 'then'
    },
    schemaPath: '#/properties/components/items/allOf/0/allOf/2/if'
  }
];
