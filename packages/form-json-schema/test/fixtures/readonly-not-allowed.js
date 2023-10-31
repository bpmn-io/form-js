export const form = {
  type: 'default',
  components: [
    {
      type: 'text',
      text: 'text',
      readonly: true
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0/readonly',
    schemaPath: '#/properties/components/items/allOf/1/allOf/2/then/properties/readonly/false schema',
    keyword: 'false schema',
    params: {},
    message: 'boolean schema is false'
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/1/allOf/2/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema'
  }
];