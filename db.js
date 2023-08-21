const mysql = require('mysql');


// database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pipPip',
  port: 3306,
});

module.exports = connection;