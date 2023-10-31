export const form = {
  type: 'default',
  components: [
    {
      type: 'text',
      text: 'text',
      serializeToString: true
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0/serializeToString',
    schemaPath: '#/properties/components/items/allOf/1/allOf/6/then/properties/serializeToString/false schema',
    keyword: 'false schema',
    params: {},
    message: 'boolean schema is false'
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/1/allOf/6/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema'
  }
];