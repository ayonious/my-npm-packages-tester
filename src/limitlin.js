const { Table } = require("console-table-printer");

const p = new Table({
  columns: [
    { name: "Index", alignment: "left", color: "red" },
    { name: "right_align_text", alignment: "right", maxLen: 10, title: 'maxLen10' },
    { name: "green", alignment: "center", color: "green" },
  ],
});

// add rows with color
p.addRow(
  {
    Index: 2,
    right_align_text: "This row is blue",
    green: 10.212,
  },
  { color: "blue" }
);
p.addRow(
  {
    Index: 3,
    right_align_text: "I would like some red wine please",
    green: 10.212,
  },
  { color: "red" }
);

// print
p.printTable();