export const form = {
  type: 'default',
  components: [
    {
      type: 'textfield'
    },
    {
      type: 'text'
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/0/allOf/0/then/required',
    keyword: 'required',
    params: { missingProperty: 'key' },
    message: "must have required property 'key'"
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/0/allOf/0/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema'
  }
];