export const form = {
  type: 'default',
  components: [
    {
      id: 'Multipage_1',
      type: 'multipage',
      path: 'wizard',
      components: [],
    },
  ],
};

export const errors = [
  {
    instancePath: '/components/0/path',
    schemaPath: '#/properties/components/items/allOf/1/allOf/27/then/properties/path/false schema',
    keyword: 'false schema',
    params: {},
    message: 'boolean schema is false',
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/1/allOf/27/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema',
  },
];
