export const form = {
  type: 'default',
  components: [],
  schemaVersion: 18,
};

export const errors = [
  {
    instancePath: '/schemaVersion',
    schemaPath: '#/properties/schemaVersion/maximum',
    keyword: 'maximum',
    params: { comparison: '<=', limit: 17 },
    message: 'must be <= 17',
  },
];
