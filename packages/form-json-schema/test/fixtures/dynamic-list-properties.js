
export const form = {
  type: 'default',
  components: [
    {
      type: 'dynamiclist',
      path: 'myGroup',
      isRepeating: true,
      defaultRepetitions: 5,
      allowAddRemove: true,
      disableCollapse: false,
      nonCollapsedItems: 3
    }
  ]
};

export const errors = null;