export const form = {
  type: 'default',
  components: [
    {
      type: 'number',
      key: 'number',
      defaultValue: true
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0/defaultValue',
    schemaPath: '#/properties/components/items/allOf/2/allOf/2/then/properties/defaultValue/type',
    keyword: 'type',
    params: { type: [ 'number', 'string' ] },
    message: 'must be number,string'
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/2/allOf/2/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema'
  }
];