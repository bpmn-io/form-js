export const form = {
  type: 'default',
  components: [
    {
      id: 'Group_1',
      type: 'group',
      label: 'A group',
      showSubmit: true,
      requireValidPage: true,
      components: [],
    },
  ],
};

export const errors = [
  {
    instancePath: '/components/0/showSubmit',
    schemaPath: '#/properties/components/items/allOf/1/allOf/28/then/properties/showSubmit/false schema',
    keyword: 'false schema',
    params: {},
    message: 'boolean schema is false',
  },
  {
    instancePath: '/components/0/requireValidPage',
    schemaPath: '#/properties/components/items/allOf/1/allOf/28/then/properties/requireValidPage/false schema',
    keyword: 'false schema',
    params: {},
    message: 'boolean schema is false',
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/1/allOf/28/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema',
  },
];
