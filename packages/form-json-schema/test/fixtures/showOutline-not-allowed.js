export const form = {
  type: 'default',
  components: [
    {
      type: 'text',
      text: 'text',
      showOutline: false
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0/showOutline',
    schemaPath: '#/properties/components/items/allOf/1/allOf/14/then/properties/showOutline/false schema',
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