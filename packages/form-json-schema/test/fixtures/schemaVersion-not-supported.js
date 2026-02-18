export const form = {
  type: 'default',
  components: [],
  schemaVersion: 19,
};

export const errors = [
  {
    instancePath: '/schemaVersion',
    schemaPath: '#/properties/schemaVersion/maximum',
    keyword: 'maximum',
    params: { comparison: '<=', limit: 18 },
    message: 'must be <= 18',
  },
];
