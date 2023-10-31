export const form = {
  type: 'default',
  components: [],
  schemaVersion: 13
};

export const errors = [
  {
    instancePath: '/schemaVersion',
    schemaPath: '#/properties/schemaVersion/maximum',
    keyword: 'maximum',
    params: { comparison: '<=', limit: 12 },
    message: 'must be <= 12'
  }
];