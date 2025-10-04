// const mysql = require('mysql2/promise')

// let db;

// async () => {
//     try{
//         db = await mysql.createConnection({
//             host: 'root',
//             user: 'localhost',
//             password: '1234',
//             database: 'test_db'
//     })
//         console.log('Connected to MySQL database');
//     }
//     catch(err){
//         console.error('Database connection failed:', err);
//     }
// }

// module.exports = db;

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

module.exports = db;
