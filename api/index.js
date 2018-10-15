const express = require("express");
var bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");

var app = express();
const port = 2018;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Brighnest97",
  database: "hotelbertasbih",
  port: 3306
});

app.get("/", (req, res) => {
  res.send("<h1>API HOTELBERTASBIH AKTIF!</h1>");
});

app.get("/room", (req, res) => {
  var sql = `select k. * from tablekamar k`;
  conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
  //   res.send("<h1>API HOTELBERTASBIH AKTIF!</h1>");
});

app.post("/filterbycategory", (req, res) => {
  var { idCategory } = req.body;

  var sql = `select k. * from tablekamar k where k.categoryid=${idCategory}`;
  conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.post("/createnewroom", (req, res) => {
  var { nomorkamar, categoryid, harga } = req.body;
  newRoom = { nomorkamar, categoryid, harga };

  var sql = `select k. * from tablekamar k where k.nomorkamar=${nomorkamar}`;
  conn.query(sql, (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      res.send({ error: "NOMOR KAMAR SUDAH ADA!" });
    } else {
      var sql = `INSERT INTO tablekamar SET ?`;
      conn.query(sql, newRoom, (err, results) => {
        if (err) throw err;

        var sql = `select * from tablekamar`;
        conn.query(sql, (err, results1) => {
          if (err) throw err;
          res.send(results1);
        });
      });
    }
  });
});

app.post("/createnewcategory", (req, res) => {
  var { namacategory } = req.body;
  newCategory = { namacategory };

  var sql = `select k. * from tablecategory k where k.namacategory=${namacategory}`;
  conn.query(sql, (err, results) => {
    if (err) throw err;

    if (results.length === 1) {
      res.send({ error: "NAMA CATEGORY SUDAH ADA!" });
    } else {
      var sql = `INSERT INTO tablecategory SET ?`;
      conn.query(sql, newCategory, (err, results) => {
        if (err) throw err;

        var sql = `select * from tablecategory`;
        conn.query(sql, (err, results1) => {
          if (err) throw err;
          res.send(results1);
        });
      });
    }
  });
});

app.put("/updateroom", (req, res) => {
  var { id, nomorkamar, categoryid, harga } = req.body;
  updatedRoom = { id, nomorkamar, categoryid, harga };
  var sql = `UPDATE tablekamar SET ? WHERE id=${id}`;
  conn.query(sql, updatedRoom, (err, results) => {
    if (err) throw err;

    sql = `SELECT * from tablekamar`;
    conn.query(sql, (err, results1) => {
      if (err) throw err;

      res.send(results1);
    });
  });
});

app.put("/updatecategory", (req, res) => {
  var { id, namacategory } = req.body;
  updatedCategory = { id, namacategory };
  var sql = `UPDATE tablecategory SET ? WHERE id=${id}`;
  conn.query(sql, namacategory, (err, results) => {
    if (err) throw err;

    sql = `SELECT * from tablecategory`;
    conn.query(sql, (err, results1) => {
      if (err) throw err;

      res.send(results1);
    });
  });
});

app.post("/deleteroom", (req, res) => {
  var { id } = req.body;
  var sql = `DELETE from tablekamar WHERE id=${id}`;
  conn.query(sql, (err, resulrs) => {
    if (err) throw err;
    sql = `SELECT * from tablekamar`;
    conn.query(sql, (err, results1) => {
      if (err) throw err;
      res.send(results1);
    });
  });
});

app.post("/deletecategory", (req, res) => {
  var { id } = req.body;
  var sql = `DELETE from tablecategory WHERE id=${id}`;
  conn.query(sql, (err, resulrs) => {
    if (err) throw err;
    sql = `DELETE from tablekamar where categoryid=${id}`;
    conn.query(sql, (err, results1) => {
      if (err) throw err;
      sql = `SELECT * from tablecategory`;
      conn.query(sql, (err, results2) => {
        if (err) throw err;
        res.send(results1);
      });
    });
  });
});

app.post("/register", (req, res) => {
  var { username, email, password, role } = req.body;
  newUser = { username, email, password, role };
  var sql = `SELECT u. * from tableuser u where u.email=${email} or u.username=${username}`;
  conn.query(sql, (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      res.send({ error: "EMAIL ATAU USERNAME SUDAH TERDAFTAR SUDAH ADA!" });
    } else {
      var sql = `INSERT INTO tableusesr SET ?`;
      conn.query(sql, newUser, (err, results) => {
        if (err) throw err;

        var sql = `select * from tableuser`;
        conn.query(sql, (err, results1) => {
          if (err) throw err;
          res.send(results1);
        });
      });
    }
  });
});

app.post("/login", (req, res) => {
  var { username, email, password, role } = req.body;
  newUser = { username, email, password, role };
  var sql = `SELECT u. * from tableuser u where u.email=${email} and u.password=${password}`;
  conn.query(sql, (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      res.send({ error: "EMAIL ATAU USERNAME SALAH!" });
    } else {
      res.send(results);
    }
  });
});

app.listen(port, () => console.log(`API Active at localhost:${port}!`));
