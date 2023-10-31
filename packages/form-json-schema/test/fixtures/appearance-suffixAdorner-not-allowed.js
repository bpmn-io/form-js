export const form = {
  type: 'default',
  components: [
    {
      type: 'textarea',
      key: 'text',
      appearance: {
        suffixAdorner: 'suffix'
      }
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0/appearance/suffixAdorner',
    schemaPath: '#/properties/components/items/allOf/1/allOf/11/then/properties/appearance/properties/suffixAdorner/false schema',
    keyword: 'false schema',
    params: {},
    message: 'boolean schema is false'
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/1/allOf/11/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema'
  }
];