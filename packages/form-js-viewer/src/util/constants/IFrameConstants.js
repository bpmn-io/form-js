export const SANDBOX_ATTRIBUTE = 'sandbox';
export const ALLOW_ATTRIBUTE = 'allow';

// Cf. https://developer.mozilla.org/en-US/docs/Web/HTTP/Permissions_Policy#iframe_syntax
export const SECURITY_ATTRIBUTES_DEFINITIONS = [
  {
    attribute: SANDBOX_ATTRIBUTE,
    directive: 'allow-scripts',
    property: 'allowScripts',
    label: 'Script execution'
  },
  {
    attribute: SANDBOX_ATTRIBUTE,
    directive: 'allow-same-origin',
    property: 'allowSameOrigin',
    label: 'Allow same origin'
  },
  {
    attribute: ALLOW_ATTRIBUTE,
    directive: 'fullscreen',
    property: 'fullscreen',
    label: 'Open in fullscreen'
  },
  {
    attribute: ALLOW_ATTRIBUTE,
    directive: 'geolocation',
    property: 'geolocation',
    label: 'Geolocation'
  },
  {
    attribute: ALLOW_ATTRIBUTE,
    directive: 'camera',
    property: 'camera',
    label: 'Camera access'
  },
  {
    attribute: ALLOW_ATTRIBUTE,
    directive: 'microphone',
    property: 'microphone',
    label: 'Microphone access'
  },
  {
    attribute: SANDBOX_ATTRIBUTE,
    directive: 'allow-forms',
    property: 'allowForms',
    label: 'Forms submission'
  },
  {
    attribute: SANDBOX_ATTRIBUTE,
    directive: 'allow-modals',
    property: 'allowModals',
    label: 'Open modal windows'
  },
  {
    attribute: SANDBOX_ATTRIBUTE,
    directive: 'allow-popups',
    property: 'allowPopups',
    label: 'Open popups'
  },
  {
    attribute: SANDBOX_ATTRIBUTE,
    directive: 'allow-top-navigation',
    property: 'allowTopNavigation',
    label: 'Top level navigation'
  },
  {
    attribute: SANDBOX_ATTRIBUTE,
    directive: 'allow-storage-access-by-user-activation',
    property: 'allowStorageAccessByUserActivation',
    label: 'Storage access by user'
  }
];