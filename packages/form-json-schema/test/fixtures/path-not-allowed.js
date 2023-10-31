export const form = {
  type: 'default',
  components: [
    {
      type: 'text',
      text: 'text',
      path: 'foobar'
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0/path',
    schemaPath: '#/properties/components/items/allOf/1/allOf/14/then/properties/path/false schema',
    keyword: 'false schema',
    params: {},
    message: 'boolean schema is false'
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/1/allOf/14/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema'
  }
];