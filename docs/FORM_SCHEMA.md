# Form Schema

A form is defined as JSON.

## Reference

Find a complete component reference in the [Camunda Platform documentation](https://docs.camunda.io/docs/components/modeler/forms/form-element-library/forms-element-library/).

## Example

```json
{
  "components": [
    {
      "type": "text",
      "text": "# Invoice\nLorem _ipsum_ __dolor__ `sit`.\n  \n  \nA list of BPMN symbols:\n* Start Event\n* Task\nLearn more about [forms](https://bpmn.io).\n  \n"
    },
    {
      "key": "creditor",
      "label": "Creditor",
      "type": "textfield",
      "validate": {
        "required": true
      },
      "layout": {
        "columns": 8,
        "row": "Row_1"
      }
    },
    {
      "description": "An invoice number in the format: C-123.",
      "key": "invoiceNumber",
      "label": "Invoice Number",
      "type": "textfield",
      "validate": {
        "pattern": "^C-[0-9]+$"
      },
       "layout": {
        "columns": 8,
        "row": "Row_1"
      }
    },
    {
      "key": "amount",
      "label": "Amount",
      "type": "number",
      "validate": {
        "min": 0,
        "max": 1000
      }
    },
    {
      "key": "approved",
      "label": "Approved",
      "type": "checkbox"
    },
    {
      "key": "approvedBy",
      "label": "Approved By",
      "type": "textfield",
      "conditional": {
        "hide": "=approved = false"
      }
    },
    {
      "key": "approverComments",
      "label": "Approver comments",
      "type": "textarea",
      "conditional": {
        "hide": "=approved = false"
      }
    },
    {
      "key": "supportPhoneNumber",
      "label": "Support Phone Number ",
      "type": "textfield",
      "validate": {
        "validationType": "phone"
      }
    },
    {
      "key": "mailto",
      "label": "Email data to",
      "type": "checklist",
      "values": [
        {
          "label": "Approver",
          "value": "approver"
        },
        {
          "label": "Manager",
          "value": "manager"
        },
        {
          "label": "Regional Manager",
          "value": "regional-manager"
        }
      ]
    },
    {
      "key": "product",
      "label": "Product",
      "type": "radio",
      "values": [
        {
          "label": "Camunda Platform",
          "value": "camunda-platform"
        },
        {
          "label": "Camunda Cloud",
          "value": "camunda-cloud"
        }
      ]
    },
    {
      "key": "dri",
      "label": "Assign DRI",
      "type": "radio",
      "valuesKey": "queriedDRIs"
    },
    {
      "key": "tags",
      "label": "Taglist",
      "type": "taglist",
      "values": [
        {
          "label": "Tag1",
          "value": "tag1"
        },
        {
          "label": "Tag2",
          "value": "tag2"
        },
        {
          "label": "Tag3",
          "value": "tag3"
        }
      ]
    },
    {
      "key": "language",
      "label": "Language",
      "type": "select",
      "values": [
        {
          "label": "German",
          "value": "german"
        },
        {
          "label": "English",
          "value": "english"
        }
      ]
    },
    {
      "key": "conversation",
      "type": "datetime",
      "subtype": "datetime",
      "dateLabel": "Date of conversation",
      "timeLabel": "Time of conversation",
      "timeSerializingFormat": "utc_normalized",
      "timeInterval": 15,
      "use24h": false
    },
    {
      "source": "=logo",
      "alt": "The bpmn.io logo",
      "type": "image"
    },
    {
      "key": "disabled",
      "label": "A disabled field",
      "type": "textfield",
      "defaultValue": "some value",
      "disabled": true
    },
    {
      "key": "readonly",
      "label": "A readonly field",
      "type": "textfield",
      "defaultValue": "some value",
      "readonly": true
    },
    {
      "key": "submit",
      "label": "Submit",
      "type": "button"
    },
    {
      "action": "reset",
      "key": "reset",
      "label": "Reset",
      "type": "button"
    }
  ],
  "type": "default"
}
```
