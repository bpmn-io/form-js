export const form = {
  type: 'default',
  components: [],
  schemaVersion: 20,
};

export const errors = [
  {
    instancePath: '/schemaVersion',
    schemaPath: '#/properties/schemaVersion/maximum',
    keyword: 'maximum',
    params: { comparison: '<=', limit: 19 },
    message: 'must be <= 19',
  },
];
