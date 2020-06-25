const { printTable, Table } = require('console-table-printer');

const data = [
  {
    date: '2020-05-20',
    mismatches: 209,
    matches: 245,
  },
  {
    date: '2020-05-21',
    mismatches: 187,
    matches: 243,
  },
  {
    date: '2020-05-22',
    mismatches: 216,
    matches: 224,
  },
  {
    date: '2020-05-23',
    mismatches: 145,
    matches: 205,
  },
  {
    date: '2020-05-24',
    mismatches: 171,
    matches: 210,
  },
  {
    date: '2020-05-25',
    mismatches: 259,
    matches: 329,
  },
  {
    date: '2020-05-26',
    mismatches: 205,
    matches: 276,
  },
  {
    date: '2020-05-27',
    mismatches: 8112,
    matches: 9052,
  },
  {
    date: '2020-05-28',
    mismatches: 1454,
    matches: 1773,
  },
  {
    date: '2020-05-29',
    mismatches: 1601,
    matches: 1807,
  },
  {
    date: '2020-05-30',
    mismatches: 1345,
    matches: 1642,
  },
  {
    date: '2020-05-31',
    mismatches: 1361,
    matches: 1604,
  },
  {
    date: '2020-06-01',
    mismatches: 1690,
    matches: 1914,
  },
  {
    date: '2020-06-02',
    mismatches: 334,
    matches: 419,
  },
];

const t = new Table({
  style: 'fatBorder', //style of border of the table, (optional)default = thinBorder
  enabledColumns: ['mismatches', 'date'],
});

t.addRows(data);

t.printTable();
