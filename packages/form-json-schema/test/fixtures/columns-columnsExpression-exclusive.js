export const form = {
  type: 'default',
  components: [
    {
      type: 'table',
      rowCount: 10,
      columns: [],
      columnsExpression: '=foo',
      dataSource: 'field'
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0',
    keyword: 'oneOf',
    message: 'must match exactly one schema in oneOf',
    params: {
      passingSchemas: [ 0, 1 ],
    },
    schemaPath: '#/properties/components/items/allOf/0/allOf/1/then/oneOf',
  },
  {
    instancePath: '/components/0',
    keyword: 'if',
    message: 'must match "then" schema',
    params: {
      failingKeyword: 'then',
    },
    schemaPath: '#/properties/components/items/allOf/0/allOf/1/if',
  },
  {
    instancePath: '/components/0/columnsExpression',
    keyword: 'false schema',
    message: 'boolean schema is false',
    params: {},
    schemaPath:
      '#/properties/components/items/allOf/1/allOf/18/then/oneOf/0/properties/columnsExpression/false schema',
  },
  {
    instancePath: '/components/0/columns',
    keyword: 'false schema',
    message: 'boolean schema is false',
    params: {},
    schemaPath:
      '#/properties/components/items/allOf/1/allOf/18/then/oneOf/1/properties/columns/false schema',
  },
  {
    instancePath: '/components/0',
    keyword: 'oneOf',
    message: 'must match exactly one schema in oneOf',
    params: {
      passingSchemas: null,
    },
    schemaPath: '#/properties/components/items/allOf/1/allOf/18/then/oneOf',
  },
  {
    instancePath: '/components/0',
    keyword: 'if',
    message: 'must match "then" schema',
    params: {
      failingKeyword: 'then',
    },
    schemaPath: '#/properties/components/items/allOf/1/allOf/18/if',
  },
];
