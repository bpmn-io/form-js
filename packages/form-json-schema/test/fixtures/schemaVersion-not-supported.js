export const form = {
  type: 'default',
  components: [],
  schemaVersion: 14
};

export const errors = [
  {
    instancePath: '/schemaVersion',
    schemaPath: '#/properties/schemaVersion/maximum',
    keyword: 'maximum',
    params: { comparison: '<=', limit: 13 },
    message: 'must be <= 13'
  }
];