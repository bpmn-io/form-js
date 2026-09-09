export const form = {
  type: 'default',
  components: [
    {
      id: 'Multipage_1',
      type: 'multipage',
      showSubmit: true,
      disableInvalidNavigation: true,
      components: [
        {
          id: 'Page_1',
          type: 'page',
          label: 'Account type',
          nextLabel: 'Continue',
          components: [
            {
              id: 'Radio_1',
              type: 'radio',
              key: 'accountType',
              label: 'Account type',
              values: [
                { label: 'Private', value: 'private' },
                { label: 'Business', value: 'business' },
              ],
            },
          ],
        },
        {
          id: 'Page_2',
          type: 'page',
          label: 'Company details',
          nextLabel: 'Review',
          backLabel: 'Change account type',
          conditional: {
            hide: '=accountType != "business"',
          },
          components: [
            {
              id: 'Textfield_1',
              type: 'textfield',
              key: 'companyName',
              label: 'Company name',
            },
          ],
        },
        {
          id: 'Page_3',
          type: 'page',
          label: 'Review',
          backLabel: 'Back',
          submitLabel: 'Finish',
          components: [],
        },
      ],
    },
  ],
};

export const errors = null;
