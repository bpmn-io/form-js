export const form = {
  type: 'default',
  components: [
    {
      type: 'textfield',
      key: 'field_email',
      validate: {
        validationType: 'email'
      }
    },
    {
      type: 'textfield',
      key: 'field_phone',
      validate: {
        validationType: 'phone'
      }
    },
    {
      type: 'textfield',
      key: 'field_custom',
      validate: {
        validationType: 'custom'
      }
    },
    {
      type: 'textfield',
      key: 'field_empty',
      validate: {
        validationType: ''
      }
    },
    {
      type: 'textfield',
      key: 'field_undefined',
      validate: {}
    }
  ]
};

export const errors = null;