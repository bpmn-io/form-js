export const form = {
  type: 'default',
  components: [
    {
      type: 'textfield',
      key: 'textfield_g35o3e',
      multiple: true,
    },
  ],
};

export const errors = [
  {
    instancePath: '/components/0/multiple',
    keyword: 'false schema',
    message: 'boolean schema is false',
    params: {},
    schemaPath: '#/properties/components/items/allOf/1/allOf/20/then/properties/multiple/false schema',
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/1/allOf/20/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema',
  },
];
