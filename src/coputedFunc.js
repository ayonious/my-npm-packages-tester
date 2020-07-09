const { printTable, Table } = require('console-table-printer');

const p = new Table({
  title: 'Analysis Results',
  columns: [{ name: 'red_amount' }, { name: 'blue_amount' }],
});

// add rows
p.addRows([
  {
    red_amount: 2,
    blue_amount: 3,
  },
  {
    red_amount: 1,
    blue_amount: 1,
  },
  {
    red_amount: 5,
    blue_amount: 6,
  },
]);

// print
p.printTable();
