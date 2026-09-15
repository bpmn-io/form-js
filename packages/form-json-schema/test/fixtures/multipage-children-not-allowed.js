export const form = {
  type: 'default',
  components: [
    {
      id: 'Multipage_1',
      type: 'multipage',
      components: [
        {
          id: 'Textfield_1',
          type: 'textfield',
          key: 'name',
          label: 'Name',
        },
      ],
    },
  ],
};

export const errors = [
  {
    instancePath: '/components/0/components/0/type',
    schemaPath:
      '#/properties/components/items/allOf/3/allOf/0/then/properties/components/items/properties/type/const',
    keyword: 'const',
    params: { allowedValue: 'page' },
    message: 'must be equal to constant',
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/3/allOf/0/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema',
  },
];
