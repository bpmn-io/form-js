export const form = {
  type: 'default',
  components: [
    {
      type: 'textfield',
      key: 'textfield_readonly_expression',
      readonly: '=foo'
    },
    {
      type: 'textfield',
      key: 'textfield_label_expression',
      label: '=foo'
    },
    {
      type: 'textfield',
      key: 'textfield_description_expression',
      description: '=foo'
    },
    {
      type: 'image',
      alt: '=foo'
    },
    {
      type: 'image',
      source: '=foo'
    },
    {
      type: 'textfield',
      key: 'textfield_prefix_expression',
      appearance: {
        prefix: '=foo'
      }
    },
    {
      type: 'textfield',
      key: 'textfield_suffix_expression',
      appearance: {
        suffix: '=foo'
      }
    },
    {
      type: 'textfield',
      key: 'textfield_hide_expression',
      conditional: {
        hide: '=foo'
      }
    },
    {
      type: 'text',
      text: '=text'
    },
    {
      type: 'textfield',
      key: 'textfield_minLength_expression',
      validate: {
        minLength: '=foo'
      }
    },
    {
      type: 'textfield',
      key: 'textfield_maxLength_expression',
      validate: {
        maxLength: '=foo'
      }
    },
    {
      type: 'number',
      key: 'number_max_expression',
      validate: {
        max: '=foo'
      }
    },
    {
      type: 'number',
      key: 'number_min_expression',
      validate: {
        min: '=foo'
      }
    }
  ]
};

export const errors = null;