const { printTable, Table } = require('console-table-printer');

const p = new Table();
p.addRows([{ index: 12, value: 0 }, { index: 12 }, { index: 1, value: 1 }]);
p.printTable();
