export const form = {
  type: 'default',
  components: [
    {
      type: 'text',
      text: 'text',
      rowCount: 10
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0/rowCount',
    schemaPath: '#/properties/components/items/allOf/1/allOf/16/then/properties/rowCount/false schema',
    keyword: 'false schema',
    params: {},
    message: 'boolean schema is false'
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/1/allOf/16/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema'
  }
];