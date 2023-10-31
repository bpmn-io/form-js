export const form = {
  type: 'default',
  components: [
    {
      type: 'text',
      text: 'text',
      timeLabel: 'date'
    }
  ]
};

export const errors = [
  {
    instancePath: '/components/0/timeLabel',
    schemaPath: '#/properties/components/items/allOf/1/allOf/5/then/properties/timeLabel/false schema',
    keyword: 'false schema',
    params: {},
    message: 'boolean schema is false'
  },
  {
    instancePath: '/components/0',
    schemaPath: '#/properties/components/items/allOf/1/allOf/5/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema'
  }
];