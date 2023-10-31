export const form = {
  type: 'default',
  components: [
    {
      type: 'text',
      text: 'text',
      action: 'submit'
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0/action',
    schemaPath: '#/properties/components/items/allOf/1/allOf/3/then/properties/action/false schema',
    keyword: 'false schema',
    params: {},
    message: 'boolean schema is false'
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/1/allOf/3/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema'
  }
];