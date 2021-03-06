const { Table } = require('console-table-printer');
const chalk = require('chalk');

describe('calculateColumns.test', () => {
  it(`Simple Test`, function () {

    const p = new Table({
      columns: [
        { name: "red_amount", color: "red" },
        { name: "blue_amount", color: "blue" },
        { name: "amount", color: "blue" },
      ],
      computedColumns: [
        // creating new columns based on other column vals
        {
          name: "sum",
          function: (row) => row.red_amount + row.blue_amount,
        },
        {
          name: "red_percent",
          function: (row) => { 
            const val = ((row.red_amount / row.sum) * 100).toFixed(2);
            if(val <= 50) {
              return chalk.red(val);
            }
            return chalk.blue(val);
          },
        },
      ],
    });

    // add rows
    p.addRows([
    {
      red_amount: 12,
      blue_amount: 40,
    },
    {
      red_amount: 22,
      blue_amount: 7,
    },
    {
      red_amount: 90,
      blue_amount: 10,
    },
    {
      red_amount: 1,
      blue_amount: 10,
    },
    ]);

    // print
    p.printTable();  
  })
});