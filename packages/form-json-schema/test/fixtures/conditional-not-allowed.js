export const form = {
  type: 'default',
  components: [],
  conditional: {}
};

export const errors = [
  {
    instancePath: '/conditional',
    schemaPath: '#/allOf/0/allOf/0/then/properties/conditional/false schema',
    keyword: 'false schema',
    params: {},
    message: 'boolean schema is false'
  },
  {
    instancePath: '',
    schemaPath: '#/allOf/0/allOf/0/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema'
  }
];