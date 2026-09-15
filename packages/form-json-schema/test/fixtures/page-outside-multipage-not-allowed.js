export const form = {
  type: 'default',
  components: [
    {
      id: 'Group_1',
      type: 'group',
      label: 'A group',
      components: [
        {
          id: 'Page_1',
          type: 'page',
          label: 'A page',
          components: [],
        },
      ],
    },
  ],
};

export const errors = [
  {
    instancePath: '/components/0/components/0/type',
    schemaPath: '#/properties/components/items/allOf/3/allOf/1/then/properties/components/items/properties/type/not',
    keyword: 'not',
    params: {},
    message: 'must NOT be valid',
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/3/allOf/1/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema',
  },
];
