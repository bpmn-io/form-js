export const form = {
  type: 'default',
  components: [
    {
      type: 'text',
      text: 'text',
      alt: 'alt'
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0/alt',
    schemaPath: '#/properties/components/items/allOf/1/allOf/4/then/properties/alt/false schema',
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