export const form = {
  type: 'default',
  components: [
    {
      type: 'text',
      text: 'text',
      valuesExpression: '=foo'
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0/valuesExpression',
    schemaPath: '#/properties/components/items/allOf/1/allOf/8/then/properties/valuesExpression/false schema',
    keyword: 'false schema',
    params: {},
    message: 'boolean schema is false'
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/1/allOf/8/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema'
  }
];