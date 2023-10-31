export const form = {
  type: 'default',
  components: [
    {
      type: 'textfield',
      key: 'textfield',
      defaultValue: 2
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0/defaultValue',
    schemaPath: '#/properties/components/items/allOf/2/allOf/1/then/properties/defaultValue/type',
    keyword: 'type',
    params: { type: 'string' },
    message: 'must be string'
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/2/allOf/1/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema'
  }
];