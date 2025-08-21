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

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'test_db'
});

module.exports = db;
