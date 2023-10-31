export const form = {
  type: 'default',
  components: [
    {
      type: 'button',
      text: 'Click me',
      action: 'submit'
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0/text',
    schemaPath: '#/properties/components/items/allOf/1/allOf/0/then/properties/text/false schema',
    keyword: 'false schema',
    params: {},
    message: 'boolean schema is false'
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/1/allOf/0/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema'
  }
];