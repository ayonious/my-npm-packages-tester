const { printTable, Table } = require('console-table-printer');

const t = new Table({
  title: 'some shit',
  style: 'fatBorder', //style of border of the table, (optional)default = thinBorder
  columns: [
    { name: 'column1', alignment: 'left', color: 'red' }, //with alignment and color
    { name: 'column2', alignment: 'right' },
    { name: 'column3' },
  ],
  sort: (row1, row2) => row2.column1 - row1.column1, // sorting order of rows (optional)
  filter: (row) => row.column1 < 3, // filtering rows (optional)
});

t.addRow({ column1: 1, column2: 'red wine', column3: 0.212 });
t.addRow({ column1: 2, column2: 'very very red wine', column3: 12.12 });
t.addRow({
  column1: 3,
  column2: 'red wine and some stuffs',
  column3: 10.212,
});

t.printTable();