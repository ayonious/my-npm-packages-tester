const { Table } = require("console-table-printer");

const p = new Table({
  columns: [
    // highlight-next-line
    { name: "Serial", alignment: "left", color: "yellow" }, // column coloring
    { name: "text", alignment: "right" },
  ],
  shouldDisableColors: true,
});

// highlight-next-line
p.addRow({ Serial: 1, text: "red wine", value: 10.212 }, { color: "green" }); // row coloring

p.addRow({ Serial: 2, text: "green Veggies", value: 20.0 });
p.addRow(
  { Serial: 3, text: "Yellow Bananas", value: 100, is_priority_today: "Y" },
  { color: "yellow" }
);
p.addRow(
  { Serial: 3, text: "Cyan things", value: 100 },
  { color: "cyan" }
);
const ret = p.render();

console.log(ret);
