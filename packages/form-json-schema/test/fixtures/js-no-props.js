export const form = {
  type: 'default',
  'components': [
    {
      type: 'script',
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0',
    keyword: 'required',
    message: "must have required property 'key'",
    params: {
      missingProperty: 'key'
    },
    schemaPath: '#/properties/components/items/allOf/0/allOf/0/then/required'
  },
  {
    instancePath: '/components/0',
    keyword: 'if',
    message: 'must match "then" schema',
    params: {
      failingKeyword: 'then'
    },
    schemaPath: '#/properties/components/items/allOf/0/allOf/0/if'
  },
  {
    instancePath: '/components/0',
    keyword: 'required',
    message: "must have required property 'jsFunction'",
    params: {
      missingProperty: 'jsFunction'
    },
    schemaPath: '#/properties/components/items/allOf/0/allOf/3/then/allOf/0/required'
  },
  {
    instancePath: '/components/0',
    keyword: 'required',
    message: "must have required property 'functionParameters'",
    params: {
      missingProperty: 'functionParameters'
    },
    schemaPath: '#/properties/components/items/allOf/0/allOf/3/then/allOf/0/required'
  },
  {
    instancePath: '/components/0',
    keyword: 'required',
    message: "must have required property 'computeOn'",
    params: {
      missingProperty: 'computeOn'
    },
    schemaPath: '#/properties/components/items/allOf/0/allOf/3/then/allOf/0/required'
  },
  {
    instancePath: '/components/0',
    keyword: 'if',
    message: 'must match "then" schema',
    params: {
      failingKeyword: 'then'
    },
    schemaPath: '#/properties/components/items/allOf/0/allOf/3/if'
  }
];


