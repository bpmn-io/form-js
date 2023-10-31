export const form = {
  type: 'default',
  components: [
    {
      'id': 'id_dynamic_list',
      'path': 'dynamic',
      'label': 'Dynamic list',
      'type': 'dynamiclist',
      'components': []
    },
    {
      'id': 'id_dynamic_list_2',
      'path': 'dynamic2',
      'label': 'Dynamic list',
      'type': 'dynamiclist',
      'showOutline': true,
    },
    {
      'id': 'id_dynamic_list_parent',
      'path': 'dynamicParent',
      'label': 'Dynamic list parent',
      'type': 'dynamiclist',
      'components': [
        {
          'id': 'id_dynamic_list_child',
          'path': 'dynamicChild',
          'label': 'Dynamic list child',
          'type': 'dynamiclist',
          'components': []
        }
      ]
    }
  ]
};

export const errors = null;