const { Table } = require('console-table-printer');

const p = new Table({
  enabledColumns: ['id', 'text'],
});

// add rows with color
p.addRows([
  {
    id: 2,
    text: 'This row is some shit',
    garbages: 10.212,
  },
  {
    id: 3,
    text: 'I would like some more text',
    garbages: 10.212,
  },
  {
    id: 4,
    text: 'I would like some text',
    garbages: 'some garbase shit that I dont want to see',
  },
]);

p.printTable();
