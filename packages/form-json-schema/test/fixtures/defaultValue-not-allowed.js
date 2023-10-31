export const form = {
  type: 'default',
  components: [
    {
      type: 'text',
      text: 'text',
      defaultValue: 'foo'
    },
    {
      type: 'select',
      key: 'select',
      defaultValue: 'foo',
      valuesKey: 'values'
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0/defaultValue',
    schemaPath: '#/properties/components/items/allOf/1/allOf/12/then/properties/defaultValue/false schema',
    keyword: 'false schema',
    params: {},
    message: 'boolean schema is false'
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/1/allOf/12/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema'
  },
  {
    instancePath: '/components/1/defaultValue',
    schemaPath: '#/properties/components/items/allOf/1/allOf/12/then/properties/defaultValue/false schema',
    keyword: 'false schema',
    params: {},
    message: 'boolean schema is false'
  },
  {
    instancePath: '/components/1',
    schemaPath: '#/properties/components/items/allOf/1/allOf/12/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema'
  }
];