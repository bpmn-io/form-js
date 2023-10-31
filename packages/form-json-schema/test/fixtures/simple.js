export const form = {
  'components': [
    {
      'type': 'text',
      'text': "# Invoice\n\nLorem _ipsum_ __dolor__ `sit`.\n\nA list of BPMN symbols:\n\n* Start Event\n* Task\n\nLearn more about [forms](https://bpmn.io).\n  \n  \nThis [malicious link](javascript:throw onerror=alert,'some string',123,'haha') __should not work__."
    },
    {
      'key': 'creditor',
      'label': 'Creditor',
      'type': 'textfield',
      'validate': {
        'required': true
      }
    },
    {
      'description': 'An invoice number in the format: C-123.',
      'key': 'invoiceNumber',
      'label': 'Invoice Number',
      'type': 'textfield',
      'validate': {
        'pattern': '^C-[0-9]+$'
      }
    },
    {
      'key': 'amount',
      'label': 'Amount',
      'type': 'number',
      'validate': {
        'min': 0,
        'max': 1000
      }
    },
    {
      'key': 'approved',
      'label': 'Approved',
      'type': 'checkbox'
    },
    {
      'key': 'approvedBy',
      'label': 'Approved By',
      'type': 'textfield'
    },
    {
      'key': 'approverComments',
      'label': 'Approver comments',
      'type': 'textarea'
    },
    {
      'key': 'product',
      'label': 'Product',
      'type': 'radio',
      'values': [
        {
          'label': 'Camunda Platform',
          'value': 'camunda-platform'
        },
        {
          'label': 'Camunda Cloud',
          'value': 'camunda-cloud'
        }
      ]
    },
    {
      'key': 'mailto',
      'label': 'Email Summary To',
      'type': 'checklist',
      'values': [
        {
          'label': 'Approver',
          'value': 'approver'
        },
        {
          'label': 'Manager',
          'value': 'manager'
        },
        {
          'label': 'Regional Manager',
          'value': 'regional-manager'
        }
      ]
    },
    {
      'key': 'language',
      'label': 'Language',
      'type': 'select',
      'values': [
        {
          'label': 'German',
          'value': 'german'
        },
        {
          'label': 'English',
          'value': 'english'
        }
      ]
    },
    {
      'key': 'conversation',
      'type': 'datetime',
      'subtype': 'datetime',
      'dateLabel': 'Date of conversation',
      'timeLabel': 'Time of conversation',
      'timeSerializingFormat': 'utc_normalized',
      'timeInterval': 15,
      'use24h': false
    },
    {
      'key': 'tags',
      'label': 'Taglist',
      'type': 'taglist',
      'values': [
        {
          'label': 'Tag 1',
          'value': 'tag1'
        },
        {
          'label': 'Tag 2',
          'value': 'tag2'
        },
        {
          'label': 'Tag 3',
          'value': 'tag3'
        },
        {
          'label': 'Tag 4',
          'value': 'tag4'
        },
        {
          'label': 'Tag 5',
          'value': 'tag5'
        }
      ]
    },
    {
      'alt': 'The bpmn.io logo',
      'type': 'image'
    },
    {
      'action': 'submit',
      'label': 'Submit',
      'type': 'button'
    },
    {
      'action': 'reset',
      'label': 'Reset',
      'type': 'button'
    }
  ],
  'type': 'default'
};

export const errors = null;