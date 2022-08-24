const { printTable, Table } = require('console-table-printer');

describe('Example: Print a simple Table with emojis', () => {
  it(`Emojis work`, function () {
    //Create a table
    const bundle = new Table({
      title: 'Bundle (BUNDLENAME)',
      columns: [
        { name: 'Weapon' },
        { name: 'Chroma' },
        { name: 'Quality' },
        { name: 'Price' },
      ],
      charLength: { '👍': 2, '✅': 2 },
    });
    
    bundle.addRows([
      {
        Weapon: '👍',
        Chroma: '✅',
        Quality: 'Deluxe',
        Price: '1 775 VP',
      },
    ]);
    
    bundle.printTable();
  });
});
