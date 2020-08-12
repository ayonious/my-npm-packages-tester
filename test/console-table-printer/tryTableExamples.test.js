const { printTable, Table } = require('console-table-printer');

describe('Example: Print a simple Table without table instance creation', () => {
  it(`complex tables`, function () {
    //Create a table
    const t = new Table({
      columns: [
        { name: 'column1', alignment: 'left', color: 'red' }, //with alignment and color
        { name: 'column2', alignment: 'right' },
        { name: 'column3' },
      ],
    });

    t.addRow({ column1: 1, column2: 'red wine', column3: 10.212 });
    t.addRow({ column1: 2, column2: 'red wine', column3: 10.212 });
    t.addRow({ column1: 3, column2: 'red wine', column3: 10.212 });

    t.printTable();
  });
});
