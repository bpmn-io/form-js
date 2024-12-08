export const form = {
  type: 'default',
  components: [
    {
      type: 'textfield',
      key: 'textfield_g35o3e',
      title: 'My title',
    },
  ],
};

export const errors = [
  {
    instancePath: '/components/0/title',
    keyword: 'false schema',
    message: 'boolean schema is false',
    params: {},
    schemaPath: '#/properties/components/items/allOf/1/allOf/23/then/properties/title/false schema',
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/1/allOf/23/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema',
  },
];
