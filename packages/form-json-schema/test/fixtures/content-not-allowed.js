export const form = {
  type: 'default',
  components: [
    {
      type: 'textarea',
      content: '<h1>Some HTML</h1>',
      key: 'abc'
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0/content',
    schemaPath: '#/properties/components/items/allOf/1/allOf/19/then/properties/content/false schema',
    keyword: 'false schema',
    params: {},
    message: 'boolean schema is false'
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/1/allOf/19/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema'
  }
];