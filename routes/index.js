var express = require('express');
var router = express.Router();


var pg = require("pg");

//CREATE
var create_table_insert = function ()
{
    var conString = "postgres://postgres:postgres@localhost:5432/postgres";
    var client = new pg.Client(conString);
    client.connect(function(err)
    {
        console.log(err);
    });

    client.query("CREATE TABLE IF NOT EXISTS users (name varchar(100), lastName varchar(100), age INTEGER)");
    client.query('INSERT INTO users(name, lastName,age) VALUES ($1,$2,$3)', ["James","Bond",48]);
    client.query('INSERT INTO users(name, lastName,age) VALUES ($1,$2,$3)', ["Michael","Jackson",55]);
    client.query('INSERT INTO users(name, lastName,age) VALUES ($1,$2,$3)', ["Bill","Gates",60]);

    console.log("Created");
}


// SELECT
var select_users = function(res) {
    // Spojenie s DB
    var conString = "postgres://postgres:postgres@localhost:5432/postgres";
    var client = new pg.Client(conString);
    client.connect();

    // Vyberieme vsetky data z DB
    var query = client.query("SELECT * FROM users");
    query.on("row", function (row, result) {
        result.addRow(row);
    });

    var data = [];
    query.on("end", function (result) {


        data = result.rows;

        res.render('index',{title: JSON.stringify(data)});

    });



}

create_table_insert(); // vytvorime tabulku a naplinme

router.get('/', function(req, res, next) {

    select_users(res); // predame data do index.ejs
});

module.exports = router;
