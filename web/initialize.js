var fs = require('fs');
var mysql = require('mysql');

// console.log("mysql: ", mysql);

var HOST = 'localhost';
var PORT = 3306;
var MYSQL_USER = 'root';
var MYSQL_PASS = '';
var DATABASE = 'mysql';
var TABLE = 'archive';

var connection = mysql.createConnection( {
  host: HOST,
  user: MYSQL_USER,
  password: MYSQL_PASS,
  database: DATABASE
});

connection.connect();

// rows returns an array of rows
//  each row contains an obj which contains the columns.
connection.query('SELECT * from ' + TABLE, function(err, rows, fields) {
  if (!err) {
    console.log('The select returned: ', rows);
  } else {
    console.log('Error performing select.');
  }
});

connection.end();

// Sync is ok here because this is called just once on startup.
module.exports = function () {
  // if the archive folder doesn't exist, create it.
  if (!fs.existsSync("./archives")) {
    // We use fs.mkdirSync to create the folder
    fs.mkdirSync("./archives");
  }

  // if the file doesn't exist, create it.
  if (!fs.existsSync("./archives/sites.txt")) {
    // We use fs.openSync to create the file
    var file = fs.openSync("./archives/sites.txt", "w");
    fs.closeSync(file);
  }

  // if the folder doesn't exist, create it.
  if (!fs.existsSync("./archives/sites")) {
    // We use fs.mkdirSync to create the folder
    fs.mkdirSync("./archives/sites");
  }
};
