export const form = {
  type: 'default',
  components: [
    {
      id: 'Multipage_1',
      type: 'multipage',
      label: 'Onboarding',
      showOutline: true,
      verticalAlignment: 'center',
      components: [],
    },
  ],
};

export const errors = [
  {
    instancePath: '/components/0/label',
    schemaPath: '#/properties/components/items/allOf/1/allOf/29/then/properties/label/false schema',
    keyword: 'false schema',
    params: {},
    message: 'boolean schema is false',
  },
  {
    instancePath: '/components/0/showOutline',
    schemaPath: '#/properties/components/items/allOf/1/allOf/29/then/properties/showOutline/false schema',
    keyword: 'false schema',
    params: {},
    message: 'boolean schema is false',
  },
  {
    instancePath: '/components/0/verticalAlignment',
    schemaPath: '#/properties/components/items/allOf/1/allOf/29/then/properties/verticalAlignment/false schema',
    keyword: 'false schema',
    params: {},
    message: 'boolean schema is false',
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/1/allOf/29/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema',
  },
];
