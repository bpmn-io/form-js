export const form = {
  type: 'default',
  components: [
    {
      type: 'group',
      path: 'group_1'
    },
    {
      type: 'group',
      path: 'group_2.foo'
    },
    {
      type: 'group',
      path: 'group_3.'
    },
    {
      type: 'group',
      path: ''
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/2/path',
    schemaPath: '#/properties/components/items/properties/path/pattern',
    keyword: 'pattern',
    params: { pattern: '^(\\w+(\\.\\w+)*)*$' },
    message: 'must match pattern "^(\\w+(\\.\\w+)*)*$"'
  }
];