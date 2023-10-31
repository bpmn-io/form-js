export const form = {
  type: 'default',
  components: [
    {
      type: 'text',
      text: 'text',
      description: 'text'
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0/description',
    schemaPath: '#/properties/components/items/allOf/1/allOf/2/then/properties/description/false schema',
    keyword: 'false schema',
    params: {},
    message: 'boolean schema is false'
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/1/allOf/2/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema'
  }
];