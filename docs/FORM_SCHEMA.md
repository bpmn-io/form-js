# Form Schema

A form is defined as JSON.

## Reference

Find a complete component reference in the [Camunda Platform documentation](https://docs.camunda.io/docs/components/modeler/forms/form-element-library/forms-element-library/).

## Multi page forms

A `multipage` component holds `page` components and shows one of them at a time,
with next and back controls underneath. Pages are containers: their children
write into the enclosing scope, so a key on page two reads the same as a key on
page one.

Branching uses `conditional.hide` on a page, the same property every other
component has. A hidden page is skipped by the controls and contributes nothing
to the submitted data. A page the user has moved away from stays mounted, so its
values survive navigation in either direction.

`nextLabel` and `backLabel` belong to a page, not to the container. The controls
read the labels of the page currently on screen and fall back to `Next` and
`Back`.

Set `showSubmit` on the container to finish the form from the navigation row.
The submit control replaces the next control on the last page in view, so under
branching it follows whichever page turns out to be last. Its label comes from
the `submitLabel` of that page and falls back to `Submit`. When a field on a page
that is not on screen fails validation, the container brings that page forward,
since the error is otherwise hidden.

Navigating forward validates the page being left. Navigating back does not
validate anything.

Set `requireValidPage` on the container to stop the user moving on from a page
that does not validate. The next and submit controls of an invalid page carry
`aria-disabled`. They stay focusable, and clicking one reports the errors of the
page rather than moving on.

```json
{
  "type": "multipage",
  "id": "Multipage_1",
  "showSubmit": true,
  "requireValidPage": true,
  "components": [
    {
      "type": "page",
      "id": "Page_1",
      "label": "Account type",
      "nextLabel": "Continue",
      "components": [
        {
          "key": "accountType",
          "label": "Account type",
          "type": "textfield"
        }
      ]
    },
    {
      "type": "page",
      "id": "Page_2",
      "label": "Company details",
      "backLabel": "Change account type",
      "submitLabel": "Create account",
      "conditional": {
        "hide": "=accountType != \"business\""
      },
      "components": [
        {
          "key": "company",
          "label": "Company",
          "type": "textfield"
        }
      ]
    }
  ]
}
```

Each page change fires `multipage.pageChanged` on the event bus with the
container, the page left, the page arrived at, and the repetition indexes the
container renders under.

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
