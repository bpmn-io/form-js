const type = 'table';


export default function Table(props) {
  return 'Table';
}

Table.config = {
  type,
  keyed: true,
  label: 'Table',
  group: 'presentation',
  create: (options = {}) => ({
    ...options,
    initialDemoData: [
      { id: 1, name: 'John Doe', date: '31.01.2023' },
      { id: 2, name: 'Erika Muller', date: '20.02.2023' },
      { id: 3, name: 'Dominic Leaf', date: '11.03.2023' }
    ]
  }),
};