export const form = {
  'components': [
    {
      'key': 'text_root',
      'type': 'textfield'
    },
    {
      'alt': '=alt_root',
      'type': 'image'
    },
    {
      'label': 'flat group',
      'path': '',
      'type': 'group',
      'components': [
        {
          'key': 'text_flat',
          'type': 'textfield'
        },
        {
          'alt': '=alt_flat',
          'type': 'image'
        }
      ]
    },
    {
      'label': 'nested group',
      'path': '',
      'type': 'group',
      'components': [
        {
          'label': 'nested group',
          'path': '',
          'type': 'group',
          'components': [
            {
              'key': 'text_nested',
              'type': 'textfield'
            },
            {
              'alt': '=alt_nested',
              'type': 'image'
            }
          ]
        }
      ]
    },
    {
      'label': 'pathed group',
      'path': 'pathed',
      'type': 'group',
      'components': [
        {
          'key': 'text_pathed',
          'type': 'textfield'
        },
        {
          'alt': '=alt_pathed',
          'type': 'image'
        }
      ]
    },
    {
      'label': 'separated path group',
      'path': 'separated.path',
      'type': 'group',
      'components': [
        {
          'key': 'text_separated',
          'type': 'textfield'
        },
        {
          'alt': '=alt_separated',
          'type': 'image'
        }
      ]
    },
    {
      'label': 'separated key textfield',
      'key': 'separated2.key',
      'type': 'textfield'
    }
  ],
  'type': 'default'
};

export const errors = null;