const mysql = require('mysql2');


// database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pipPip',
  port: 3306,
});

module.exports = connection;