export const form = {
  type: 'default',
  components: [],
  schemaVersion: 21,
};

export const errors = [
  {
    instancePath: '/schemaVersion',
    schemaPath: '#/properties/schemaVersion/maximum',
    keyword: 'maximum',
    params: { comparison: '<=', limit: 20 },
    message: 'must be <= 20',
  },
];
