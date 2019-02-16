let mysql = require('mysql');
let util  = require('util');

let pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.OPENSHIFT_MYSQL_DB_HOST || "localhost",
    user: process.env.OPENSHIFT_MYSQL_DB_USERNAME || "root",
    port: process.env.OPENSHIFT_MYSQL_DB_PORT || 3306,
    password: process.env.OPENSHIFT_MYSQL_DB_PASSWORD || "root",
    database: process.env.OPENSHIFT_APP_NAME || "foods"
});
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
        throw err;
    }
    if (connection) connection.release();
    console.log('Connected to Foods');
    return;
});
pool.query = util.promisify(pool.query);
module.exports = pool;
