export const form = {
  type: 'default',
  components: [
    {
      type: 'text',
      text: 'text',
      increment: '2'
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0/increment',
    schemaPath: '#/properties/components/items/allOf/1/allOf/6/then/properties/increment/false schema',
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