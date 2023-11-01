export const form = {
  'components': [
    {
      'text': '# Title 1\n## Title 2\n### Title 3\n#### Title 4\n##### Title 5\n###### Title 6\n\n<br />\n\n- list\n- list\n\n1. foo\n2. foo\n\nFoo _italic_ **bold**\n\n> Multiline code\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus auctor sodales pretium. Donec id volutpat quam, sit amet elementum lectus. \n\nInline `code`\n\n```\nMultiline code\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus auctor sodales pretium. Donec id volutpat quam, sit amet elementum lectus. \n```\n\n[Link](https://camunda.com)\n',
      'type': 'text',
      'id': 'Field_1bbbwwg',
      'layout': {
        'row': 'Row_0lqavz4'
      }
    },
    {
      'label': 'I am a texfield',
      'type': 'textfield',
      'id': 'Field_1l0t1m5',
      'key': 'textfield',
      'description': 'I am a texfield description',
      'validate': {
        'required': true
      },
      'defaultValue': 'value',
      'layout': {
        'row': 'Row_14setyc',
        'columns': 10
      }
    },
    {
      'label': 'I am a disabled texfield',
      'type': 'textfield',
      'id': 'Field_1r9b6p2',
      'key': 'disabled_textfield',
      'description': 'I am a disabled texfield description',
      'disabled': true,
      'defaultValue': 'value',
      'layout': {
        'row': 'Row_14setyc',
        'columns': 6
      }
    },
    {
      'label': 'I am a read only texfield',
      'type': 'textfield',
      'id': 'Field_1r9b6p2',
      'key': 'readonly_textfield',
      'description': 'I am a read only texfield description',
      'readonly': true,
      'defaultValue': 'value',
      'layout': {
        'row': 'Row_14setyc',
        'columns': 6
      }
    },
    {
      'label': 'I am a number field',
      'type': 'number',
      'id': 'Field_0ltb6av',
      'key': 'number_field',
      'description': 'I am a number field description',
      'validate': {
        'required': true
      },
      'defaultValue': 1,
      'layout': {
        'row': 'Row_0m8z1wj',
        'columns': 8
      }
    },
    {
      'label': 'I am a number field',
      'type': 'number',
      'id': 'Field_1t8wtoa',
      'key': 'disabled_number_field',
      'description': 'I am a disabled number field description',
      'disabled': true,
      'defaultValue': 1,
      'layout': {
        'row': 'Row_0m8z1wj',
        'columns': 8
      }
    },
    {
      'label': 'I am checkbox',
      'type': 'checkbox',
      'id': 'Field_0jqueb7',
      'key': 'checkbox',
      'description': 'I am checkbox description',
      'defaultValue': false,
      'layout': {
        'row': 'Row_0l2l6gv'
      }
    },
    {
      'label': 'I am disabled checked checkbox',
      'type': 'checkbox',
      'id': 'Field_1klmahz',
      'key': 'disabled_checked_checkbox',
      'disabled': true,
      'defaultValue': true,
      'description': 'I am disabled checked checkbox description',
      'layout': {
        'row': 'Row_0l2l6gv'
      }
    },
    {
      'label': 'I am disabled checkbox',
      'type': 'checkbox',
      'id': 'Field_01h0ngn',
      'key': 'disabled_checkbox',
      'description': 'I am disabled checkbox description',
      'disabled': true,
      'layout': {
        'row': 'Row_0l2l6gv'
      }
    },
    {
      'values': [
        {
          'label': 'Option 1',
          'value': 'option_1'
        },
        {
          'label': 'Option 2',
          'value': 'option_2'
        }
      ],
      'label': 'I am checklist',
      'type': 'checklist',
      'id': 'Field_1d5nfix',
      'key': 'checklist',
      'description': 'I am checklist description',
      'layout': {
        'row': 'Row_0luakh3',
        'columns': 8
      }
    },
    {
      'values': [
        {
          'label': 'Option 1',
          'value': 'option_2'
        },
        {
          'label': 'Option 2',
          'value': 'option_1'
        }
      ],
      'label': 'I am disabled checklist',
      'type': 'checklist',
      'id': 'Field_0l0y6cf',
      'key': 'disabled_checklist',
      'description': 'I am disabled checklist description',
      'disabled': true,
      'layout': {
        'row': 'Row_0luakh3',
        'columns': 8
      }
    },
    {
      'values': [
        {
          'label': 'Option 1',
          'value': 'option_1'
        },
        {
          'label': 'Option 2',
          'value': 'option_2'
        },
        {
          'label': 'Option 3',
          'value': 'option_3'
        }
      ],
      'label': 'I am a taglist',
      'type': 'taglist',
      'id': 'Field_07zrh4q',
      'key': 'taglist',
      'description': 'I am a taglist description',
      'layout': {
        'row': 'Row_05mdvfz'
      }
    },
    {
      'values': [
        {
          'label': 'Option 1',
          'value': 'option_1'
        },
        {
          'label': 'Option 2',
          'value': 'option_2'
        },
        {
          'label': 'Option 3',
          'value': 'option_3'
        }
      ],
      'label': 'I am a disabled taglist',
      'type': 'taglist',
      'id': 'Field_0hm9hgj',
      'key': 'disabled_taglist',
      'description': 'I am a disabled taglist description',
      'disabled': true,
      'layout': {
        'row': 'Row_0w9nbyn'
      }
    },
    {
      'values': [
        {
          'label': 'Option 1',
          'value': 'option_1'
        },
        {
          'label': 'Option 2',
          'value': 'option_2'
        },
        {
          'label': 'Option 3',
          'value': 'option_3'
        }
      ],
      'label': 'I am a radio',
      'type': 'radio',
      'id': 'Field_0i46s34',
      'key': 'radio',
      'description': 'I am a radio description',
      'validate': {
        'required': true
      },
      'layout': {
        'row': 'Row_0xpl64i'
      }
    },
    {
      'values': [
        {
          'label': 'Option 1',
          'value': 'option_1'
        },
        {
          'label': 'Option 2',
          'value': 'option_2'
        },
        {
          'label': 'Option 3',
          'value': 'option_3'
        }
      ],
      'label': 'I am a disabled radio',
      'type': 'radio',
      'id': 'Field_110t1zy',
      'key': 'disabled_radio',
      'description': 'I am a disabled radio description',
      'validate': {
        'required': false
      },
      'disabled': true,
      'layout': {
        'row': 'Row_0xpl64i'
      }
    },
    {
      'values': [
        {
          'label': 'Option 1',
          'value': 'option_1'
        },
        {
          'label': 'Option 2',
          'value': 'option_2'
        },
        {
          'label': 'Option 3',
          'value': 'option_3'
        }
      ],
      'label': 'I am a select',
      'type': 'select',
      'id': 'Field_1iw4ekg',
      'key': 'select',
      'description': 'I am a select description',
      'validate': {
        'required': true
      },
      'defaultValue': 'option_1',
      'layout': {
        'row': 'Row_084h2jt',
        'columns': 6
      }
    },
    {
      'values': [
        {
          'label': 'Option 1',
          'value': 'option_1'
        },
        {
          'label': 'Option 2',
          'value': 'option_2'
        },
        {
          'label': 'Option 3',
          'value': 'option_3'
        }
      ],
      'label': 'I am a select',
      'type': 'select',
      'id': 'Field_06g19xn',
      'key': 'disabled_select',
      'description': 'I am a select description',
      'disabled': true,
      'defaultValue': 'option_2',
      'layout': {
        'row': 'Row_084h2jt',
        'columns': 10
      }
    },
    {
      'values': [
        {
          'label': 'Option 1',
          'value': 'option_1'
        },
        {
          'label': 'Option 2',
          'value': 'option_2'
        },
        {
          'label': 'Option 3',
          'value': 'option_3'
        }
      ],
      'label': 'I am a searcheable select',
      'type': 'select',
      'id': 'Field_0g90q9s',
      'key': 'searcheable_select',
      'description': 'I am a searcheable select description',
      'searchable': true,
      'defaultValue': 'option_1',
      'validate': {
        'required': true
      },
      'layout': {
        'row': 'Row_1cn6eez'
      }
    },
    {
      'values': [
        {
          'label': 'Option 1',
          'value': 'option_1'
        },
        {
          'label': 'Option 2',
          'value': 'option_2'
        },
        {
          'label': 'Option 3',
          'value': 'option_3'
        }
      ],
      'label': 'I am a disabled searcheable select',
      'type': 'select',
      'id': 'Field_06wzkll',
      'key': 'disabled_searcheable_select',
      'description': 'I am a disabled searcheable select description',
      'searchable': true,
      'defaultValue': 'option_2',
      'disabled': true,
      'layout': {
        'row': 'Row_0benm2m'
      }
    },
    {
      'type': 'image',
      'id': 'Field_1mv8qs4',
      'alt': 'An placeholder',
      'source': 'https://via.placeholder.com/150C',
      'layout': {
        'row': 'Row_069d2ee'
      }
    },
    {
      'label': 'I am a text area',
      'type': 'textarea',
      'id': 'Field_1f2xg0s',
      'key': 'textarea',
      'description': 'I am a text area description',
      'validate': {
        'required': true
      },
      'layout': {
        'row': 'Row_16ga9gy'
      }
    },
    {
      'label': 'I am a disabled text area',
      'type': 'textarea',
      'id': 'Field_1ae1pqq',
      'key': 'disabled_textarea',
      'description': 'I am a disabled text area description',
      'disabled': true,
      'layout': {
        'row': 'Row_00hoio8'
      }
    },
    {
      'subtype': 'date',
      'dateLabel': 'I am a date field',
      'type': 'datetime',
      'id': 'Field_0h7fnn7',
      'key': 'date_field',
      'description': 'I am a date field description',
      'validate': {
        'required': true
      },
      'layout': {
        'row': 'Row_0ld8s6t'
      }
    },
    {
      'subtype': 'date',
      'dateLabel': 'I am a disabled date field',
      'type': 'datetime',
      'id': 'Field_09ff8mv',
      'key': 'disabled_date_field',
      'description': 'I am a disabled date field description',
      'disabled': true,
      'layout': {
        'row': 'Row_0b0kl2l'
      }
    },
    {
      'label': 'I am an adorned field',
      'type': 'textfield',
      'id': 'Field_0k58wk0',
      'key': 'adorned_field',
      'description': 'I am an adorned field description',
      'appearance': {
        'prefixAdorner': 'camunda.com/'
      },
      'layout': {
        'row': 'Row_0zjfzza'
      }
    },
    {
      'label': 'I am an adorned field',
      'type': 'textfield',
      'id': 'Field_0k58wk01',
      'key': 'adorned_field1',
      'description': 'I am an adorned field description',
      'appearance': {
        'suffixAdorner': '@gmail.com'
      },
      'layout': {
        'row': 'Row_1gcsy5f',
        'columns': 16
      }
    },
    {
      'label': 'I am an adorned field',
      'type': 'textfield',
      'id': 'Field_0k58wk02',
      'key': 'adorned_field2',
      'description': 'I am an adorned field description',
      'appearance': {
        'prefixAdorner': '✨',
        'suffixAdorner': '🚀'
      },
      'layout': {
        'row': 'Row_0xojlc6',
        'columns': null
      }
    },
    {
      'type': 'separator',
      'id': 'Separator_1'
    },
    {
      'id': 'Spacer_1',
      'type': 'spacer',
      'height': 60
    },
    {
      'action': 'reset',
      'label': 'reset',
      'type': 'button',
      'id': 'Field_1ydujqw',
      'layout': {
        'row': 'Row_06ecoa2'
      }
    }
  ],
  'type': 'default',
  'id': 'Form_1a82jj2',
  'executionPlatform': 'Camunda Cloud',
  'executionPlatformVersion': '8.2.0',
  'exporter': {
    'name': 'Camunda Modeler',
    'version': '5.10.0-dev'
  },
  'schemaVersion': 11
};

export const errors = null;