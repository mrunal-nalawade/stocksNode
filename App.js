const express = require("express");
const parser = require("body-parser");
const fs = require("fs");

const app = express();

let stocks = [];
fs.readFile("stock.json", (err, data) => {
  if (err) throw err;
  stocks = JSON.parse(data);
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

app.use("/page/:id/:variable", (req, res) => {
  const id = req.params.id;
  const variable = req.params.variable;
  const stock = stocks.filter((stock) => stock.id == id);
  const criteriaList = stock[0].criteria;
  let paramInfo;
  for (let obj of criteriaList) {
    if (obj.variable[variable]) {
      paramInfo = obj.variable[variable];
      break;
    }
  }
  res.json({ paramInfo });
});

app.use("/page/:id", (req, res) => {
  const id = req.params.id;
  const stock = stocks.filter((stock) => stock.id == id);
  res.json({ stock: stock[0] });
});

app.use("/page", (req, res) => {
  const stock = stocks.map((stock) => {
    return {
      id: stock.id,
      name: stock.name,
      tag: stock.tag,
      color: stock.color,
    };
  });

  res.json({ stockList: stock });
});

app.listen(5000);
