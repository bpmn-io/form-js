export const form = {
  type: 'default',
  components: [],
  schemaVersion: 16
};

export const errors = [
  {
    instancePath: '/schemaVersion',
    schemaPath: '#/properties/schemaVersion/maximum',
    keyword: 'maximum',
    params: { comparison: '<=', limit: 15 },
    message: 'must be <= 15'
  }
];