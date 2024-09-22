const mysql = require('mysql2/promise');
const config = require('./config.json');

const connection = mysql.createPool({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    connectionLimit: config.db.connectionLimit
});

module.exports = connection;