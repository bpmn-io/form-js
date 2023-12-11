export const form = {
  type: 'default',
  components: [],
  schemaVersion: 15
};

export const errors = [
  {
    instancePath: '/schemaVersion',
    schemaPath: '#/properties/schemaVersion/maximum',
    keyword: 'maximum',
    params: { comparison: '<=', limit: 14 },
    message: 'must be <= 14'
  }
];