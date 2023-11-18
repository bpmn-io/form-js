export const form = {
  type: 'default',
  components: [
    {
      type: 'table',
      key: 'table',
      rowCount: 10,
      columns: [],
      columnsExpression: '=foo'
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0/columnsExpression',
    keyword: 'false schema',
    message: 'boolean schema is false',
    params: {},
    schemaPath:
        '#/properties/components/items/allOf/1/allOf/17/then/oneOf/0/properties/columnsExpression/false schema',
  },
  {
    instancePath: '/components/0/columns',
    keyword: 'false schema',
    message: 'boolean schema is false',
    params: {},
    schemaPath:
        '#/properties/components/items/allOf/1/allOf/17/then/oneOf/1/properties/columns/false schema',
  },
  {
    instancePath: '/components/0',
    keyword: 'oneOf',
    message: 'must match exactly one schema in oneOf',
    params: {
      passingSchemas: null,
    },
    schemaPath: '#/properties/components/items/allOf/1/allOf/17/then/oneOf',
  },
  {
    instancePath: '/components/0',
    keyword: 'if',
    message: 'must match "then" schema',
    params: {
      failingKeyword: 'then',
    },
    schemaPath: '#/properties/components/items/allOf/1/allOf/17/if',
  },
];