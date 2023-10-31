export const form = {
  type: 'default',
  components: [
    {
      type: 'textfield',
      key: 'text',
      validate: {
        min: 2
      }
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0/validate/min',
    schemaPath: '#/properties/components/items/allOf/1/allOf/6/then/properties/validate/properties/min/false schema',
    keyword: 'false schema',
    params: {},
    message: 'boolean schema is false'
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/1/allOf/6/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema'
  }
];