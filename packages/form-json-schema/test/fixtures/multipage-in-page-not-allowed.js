export const form = {
  type: 'default',
  components: [
    {
      id: 'Multipage_1',
      type: 'multipage',
      components: [
        {
          id: 'Page_1',
          type: 'page',
          label: 'A page',
          components: [
            {
              id: 'Multipage_2',
              type: 'multipage',
              components: [
                {
                  id: 'Page_2',
                  type: 'page',
                  label: 'Another page',
                  components: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const errors = [
  {
    instancePath: '/components/0/components/0/components/0/type',
    schemaPath: '#/allOf/3/allOf/1/then/properties/components/items/properties/type/not',
    keyword: 'not',
    params: {},
    message: 'must NOT be valid',
  },
  {
    instancePath: '/components/0/components/0',
    schemaPath: '#/allOf/3/allOf/1/if',
    keyword: 'if',
    params: { failingKeyword: 'then' },
    message: 'must match "then" schema',
  },
];
