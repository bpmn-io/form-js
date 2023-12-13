export const form = {
  type: 'default',
  components: [
    {
      type: 'textarea',
      key: 'text',
      columns: []
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0/columns',
    schemaPath: '#/properties/components/items/allOf/1/allOf/17/then/properties/columns/false schema',
    keyword: 'false schema',
    params: {},
    message: 'boolean schema is false'
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/1/allOf/17/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema'
  }
];