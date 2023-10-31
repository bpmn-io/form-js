export const form = {
  type: 'default',
  components: [
    {
      type: 'textfield',
      key: 'textfield_1'
    },
    {
      type: 'textfield',
      key: 'textfield_2.foo'
    },
    {
      type: 'textfield',
      key: 'textfield_3.'
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/2/key',
    schemaPath: '#/properties/components/items/properties/key/pattern',
    keyword: 'pattern',
    params: { pattern: '^\\w+(\\.\\w+)*$' },
    message: 'must match pattern "^\\w+(\\.\\w+)*$"'
  }
];