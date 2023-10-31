export const form = {
  type: 'default',
  components: [
    {
      type: 'checkbox',
      key: 'checkbox',
      defaultValue: 'foo'
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0/defaultValue',
    schemaPath: '#/properties/components/items/allOf/2/allOf/0/then/properties/defaultValue/type',
    keyword: 'type',
    params: { type: 'boolean' },
    message: 'must be boolean'
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/2/allOf/0/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema'
  }
];