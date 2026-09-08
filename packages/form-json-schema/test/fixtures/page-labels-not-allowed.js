export const form = {
  type: 'default',
  components: [
    {
      id: 'Group_1',
      type: 'group',
      label: 'A group',
      nextLabel: 'Continue',
      backLabel: 'Back',
      submitLabel: 'Finish',
      components: [],
    },
  ],
};

export const errors = [
  {
    instancePath: '/components/0/nextLabel',
    schemaPath: '#/properties/components/items/allOf/1/allOf/26/then/properties/nextLabel/false schema',
    keyword: 'false schema',
    params: {},
    message: 'boolean schema is false',
  },
  {
    instancePath: '/components/0/backLabel',
    schemaPath: '#/properties/components/items/allOf/1/allOf/26/then/properties/backLabel/false schema',
    keyword: 'false schema',
    params: {},
    message: 'boolean schema is false',
  },
  {
    instancePath: '/components/0/submitLabel',
    schemaPath: '#/properties/components/items/allOf/1/allOf/26/then/properties/submitLabel/false schema',
    keyword: 'false schema',
    params: {},
    message: 'boolean schema is false',
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/1/allOf/26/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema',
  },
];
