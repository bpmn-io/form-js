export const form = {
  type: 'default',
  components: [
    {
      type: 'textfield',
      key: 'text',
      validate: {
        max: 2
      }
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0/validate/max',
    schemaPath: '#/properties/components/items/allOf/1/allOf/6/then/properties/validate/properties/max/false schema',
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