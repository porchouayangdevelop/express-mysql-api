const mysql = require('mysql');
require('dotenv').config();
exports.connect = function () {
    return mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'koa_api',
            pool: {
                max: 10,
                min: 0,
                acquire: 30000,
                idle: 10000,
                timeout: 10000,
                evict: 0,
                handleDisconnects: true,
                handleReconnections: true,
                queue: true,
                queueLimit: 0,
                waitForConnections: true,
                connectionLimit: 0,
            }
        },
        // function (err) {
        // err ? console.log(err) : console.log('Connected to database');
        // }
    );

}