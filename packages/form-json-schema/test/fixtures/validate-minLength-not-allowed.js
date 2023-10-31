export const form = {
  type: 'default',
  components: [
    {
      type: 'number',
      key: 'number',
      validate: {
        minLength: 2
      }
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0/validate/minLength',
    schemaPath: '#/properties/components/items/allOf/1/allOf/10/then/properties/validate/properties/minLength/false schema',
    keyword: 'false schema',
    params: {},
    message: 'boolean schema is false'
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/1/allOf/10/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema'
  }
];