export const form = {
  type: 'default',
  components: [
    {
      type: 'table',
      key: 'table',
      rowCount: true,
      columns: []
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0/rowCount',
    schemaPath: '#/properties/components/items/properties/rowCount/type',
    keyword: 'type',
    params: { type: 'number' },
    message: 'must be number'
  }
];