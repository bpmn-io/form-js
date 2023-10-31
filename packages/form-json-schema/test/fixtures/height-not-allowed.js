export const form = {
  type: 'default',
  components: [
    {
      type: 'text',
      text: 'text',
      height: 60
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0/height',
    schemaPath: '#/properties/components/items/allOf/1/allOf/13/then/properties/height/false schema',
    keyword: 'false schema',
    params: {},
    message: 'boolean schema is false'
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/1/allOf/13/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema'
  }
];