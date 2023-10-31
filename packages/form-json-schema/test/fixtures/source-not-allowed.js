export const form = {
  type: 'default',
  components: [
    {
      type: 'text',
      text: 'text',
      source: 'image'
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0/source',
    schemaPath: '#/properties/components/items/allOf/1/allOf/4/then/properties/source/false schema',
    keyword: 'false schema',
    params: {},
    message: 'boolean schema is false'
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/1/allOf/4/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema'
  }
];