export const form = {
  type: 'default',
  components: [
    {
      type: 'select',
      key: 'select',
      valuesKey: 'foo bar'
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0/valuesKey',
    schemaPath: '#/properties/components/items/properties/valuesKey/pattern',
    keyword: 'pattern',
    params: { pattern: '^[^\\s]*$' },
    message: 'must match pattern "^[^\\s]*$"'
  }
];