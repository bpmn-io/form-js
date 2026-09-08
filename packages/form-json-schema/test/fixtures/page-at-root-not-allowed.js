export const form = {
  type: 'default',
  components: [
    {
      id: 'Page_1',
      type: 'page',
      label: 'A page',
      components: [],
    },
  ],
};

export const errors = [
  {
    instancePath: '/components/0/type',
    schemaPath: '#/properties/components/allOf/1/items/properties/type/not',
    keyword: 'not',
    params: {},
    message: 'must NOT be valid',
  },
];
