export const form = {
  type: 'default',
  components: [
    {
      type: 'text',
      text: 'text',
      label: 'text'
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0/label',
    schemaPath: '#/properties/components/items/allOf/1/allOf/1/then/properties/label/false schema',
    keyword: 'false schema',
    params: {},
    message: 'boolean schema is false'
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/1/allOf/1/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema'
  }
];