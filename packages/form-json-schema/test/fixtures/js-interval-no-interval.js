export const form = {
  type: 'default',
  'components': [
    {
      type: 'script',
      key: 'myField',
      jsFunction: 'return 42',
      functionParameters: '={\n  value: 42\n}',
      computeOn: 'interval'
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0',
    keyword: 'required',
    message: "must have required property 'interval'",
    params: {
      missingProperty: 'interval'
    },
    schemaPath: '#/properties/components/items/allOf/0/allOf/3/then/allOf/1/then/required'
  },
  {
    instancePath: '/components/0',
    keyword: 'if',
    message: 'must match "then" schema',
    params: {
      failingKeyword: 'then'
    },
    schemaPath: '#/properties/components/items/allOf/0/allOf/3/then/allOf/1/if'
  },
  {
    instancePath: '/components/0',
    keyword: 'if',
    message: 'must match "then" schema',
    params: {
      failingKeyword: 'then'
    },
    schemaPath: '#/properties/components/items/allOf/0/allOf/3/if'
  }
];

