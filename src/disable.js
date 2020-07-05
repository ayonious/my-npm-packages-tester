const { Table } = require('console-table-printer');

const p = new Table({
  disabledColumns: ['garbages'],
});

// add rows with color
p.addRows([
  {
    good_text: 'This row is some shit',
    id: '1',
    garbages: 10.212,
  },
  {
    id: '2',
    good_text: 'I would like some more text',
    garbages: 10.212,
  },
  {
    id: '3',
    good_text: 'I would like some text',
    garbages: 'some garbase shit that I dont want to see',
  },
]);

p.printTable();
