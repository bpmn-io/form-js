export const form = {
  type: 'default',
  components: [
    {
      type: 'checklist',
      key: 'list',
      defaultValue: 'foo',
      values: []
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0/defaultValue',
    schemaPath: '#/properties/components/items/allOf/2/allOf/3/then/properties/defaultValue/type',
    keyword: 'type',
    params: { type: 'array' },
    message: 'must be array'
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/2/allOf/3/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema'
  }
];