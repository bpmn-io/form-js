export const form = {
  type: 'default',
  components: [
    {
      type: 'text',
      text: 'text',
      valuesKey: 'foo'
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0/valuesKey',
    schemaPath: '#/properties/components/items/allOf/1/allOf/8/then/properties/valuesKey/false schema',
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