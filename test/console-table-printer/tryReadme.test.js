const { printTable, Table } = require('console-table-printer');

describe('Example: Readme examples', () => {
  it(`first example`, function () {
    //Create a table
    const p = new Table();

    //add rows with color
    p.addRow({ index: 1, text: 'red wine please', value: 10.212 });
    p.addRow({ index: 2, text: 'green gemuse please', value: 20.0 });
    p.addRows([
      //adding multiple rows are possible
      { index: 3, text: 'gelb bananen bitte', value: 100 },
      { index: 4, text: 'update is working', value: 300 },
    ]);

    //print
    p.printTable();
  });

  it(`second example`, function () {
    const p = new Table();
    p.addRow({ index: 1, text: 'red wine', value: 10.212 }, { color: 'red' });
    p.addRow(
      { index: 2, text: 'green gemuse', value: 20.0 },
      { color: 'green' }
    );
    p.addRow(
      { index: 3, text: 'gelb bananen', value: 100 },
      { color: 'yellow' }
    );
    p.printTable();
  });

  it(`first example`, function () {
    const p = new Table({
      columns: [
        { name: 'index', alignment: 'left', color: 'blue' }, //with alignment and color
        { name: 'text', alignment: 'right' },
      ],
    });

    p.addRow({ index: 1, text: 'red wine', value: 10.212 }, { color: 'green' });
    p.addRow({ index: 2, text: 'green gemuse', value: 20.0 });
    p.addRow(
      { index: 3, text: 'gelb bananen', value: 100, is_priority_today: 'Y' },
      { color: 'yellow' }
    );
    p.addRow(
      { index: 3, text: 'rosa hemd wie immer', value: 100 },
      { color: 'cyan' }
    );
    p.printTable();
  });
});
