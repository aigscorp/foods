let mysql = require('mysql');
let util  = require('util');

let pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "",
    database: "foods"
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
