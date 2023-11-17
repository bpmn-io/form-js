export const form = {
  type: 'default',
  'components': [
    {
      'type': 'iframe',
      'label': 'The bpmn-io web page',
      'url': 'https://bpmn.io/',
      'height': 400,
      'security': {
        'allowSameOrigin': true,
        'fullscreen': true,
        'geolocation': true,
        'camera': true,
        'microphone': true,
        'allowForms': true,
        'allowModals': true,
        'allowPopups': true,
        'allowTopNavigation': true
      }
    }
  ]
};

export const errors = null;