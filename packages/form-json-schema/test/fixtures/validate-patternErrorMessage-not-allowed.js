export const form = {
  type: 'default',
  components: [
    {
      type: 'number',
      key: 'number',
      validate: {
        pattern: '.*',
        patternErrorMessage: 'This is not allowed.',
      },
    },
  ],
};

export const errors = [
  {
    instancePath: '/components/0/validate/pattern',
    schemaPath:
      '#/properties/components/items/allOf/1/allOf/9/then/properties/validate/properties/pattern/false schema',
    keyword: 'false schema',
    params: {},
    message: 'boolean schema is false',
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/1/allOf/9/if',
    keyword: 'if',
    params: {
      failingKeyword: 'then',
    },
    message: 'must match "then" schema',
  },
  {
    instancePath: '/components/0/validate/patternErrorMessage',
    schemaPath:
      '#/properties/components/items/allOf/1/allOf/24/then/properties/validate/properties/patternErrorMessage/false schema',
    keyword: 'false schema',
    params: {},
    message: 'boolean schema is false',
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/1/allOf/24/if',
    keyword: 'if',
    params: {
      failingKeyword: 'then',
    },
    message: 'must match "then" schema',
  },
];
