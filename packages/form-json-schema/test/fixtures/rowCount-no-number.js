export const form = {
  type: 'default',
  components: [
    {
      type: 'table',
      rowCount: true,
      columns: [],
      dataSource: 'inputVariable'
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