export const form = {
  type: 'default',
  components: [
    {
      type: 'text',
      text: 'text',
      searchable: true
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0/searchable',
    schemaPath: '#/properties/components/items/allOf/1/allOf/7/then/properties/searchable/false schema',
    keyword: 'false schema',
    params: {},
    message: 'boolean schema is false'
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/1/allOf/7/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema'
  }
];