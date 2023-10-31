export const form = {
  type: 'default',
  components: [
    {
      type: 'dynamiclist',
      verticalAlignment: 'top'
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0/verticalAlignment',
    schemaPath: '#/properties/components/items/properties/verticalAlignment/enum',
    keyword: 'enum',
    params: { allowedValues: [ 'start', 'center', 'end' ] },
    message: 'must be equal to one of the allowed values'
  }
];