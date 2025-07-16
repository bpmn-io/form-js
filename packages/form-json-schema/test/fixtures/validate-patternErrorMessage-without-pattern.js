export const form = {
  type: 'default',
  components: [
    {
      type: 'textfield',
      key: 'textfield',
      validate: {
        patternErrorMessage: 'This is a custom error message.',
      },
    },
  ],
};

export const errors = [
  {
    instancePath: '/components/0/validate',
    schemaPath: '#/properties/components/items/allOf/1/allOf/25/then/properties/validate/required',
    keyword: 'required',
    params: {
      missingProperty: 'pattern',
    },
    message: "must have required property 'pattern'",
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/1/allOf/25/if',
    keyword: 'if',
    params: {
      failingKeyword: 'then',
    },
    message: 'must match "then" schema',
  },
];
