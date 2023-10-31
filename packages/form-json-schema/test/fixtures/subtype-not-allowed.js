export const form = {
  type: 'default',
  components: [
    {
      type: 'text',
      text: 'text',
      subtype: 'date'
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0/subtype',
    schemaPath: '#/properties/components/items/allOf/1/allOf/5/then/properties/subtype/false schema',
    keyword: 'false schema',
    params: {},
    message: 'boolean schema is false'
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/1/allOf/5/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema'
  }
];