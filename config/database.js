const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('data.db');

const USER_SCHEMA = `
  CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    password VARCAHR(255) NOT NULL,
    first_name VARCAHR(40) NOT NULL,
    last_name VARCAHR(40) NOT NULL,
    join_date TIMESTAMP DEFAULT current_timestamp
  )
`;

const INSERT_DEFAULT_USER_ADMIN = `
  INSERT INTO user (
    username,
    email,
    password,
    first_name,
    last_name
  ) SELECT
    'admin',
    'admin@admin.com.br',
    '123456',
    'Admin',
    'Admin'
  WHERE NOT EXISTS (
    SELECT * FROM user
    WHERE username = 'admin'
  )
`;

db.serialize(() => {
  db.run('PRAGMA foreign_keys=ON');
  db.run(USER_SCHEMA);
  db.run(INSERT_DEFAULT_USER_ADMIN);

  db.get('SELECT * FROM user WHERE username = ?', ['admin'], (err, user) => {
    console.log(`Username: ${user.username}`);
    console.log(`Password: ${user.password}`);
  });
});

process.on('SIGINT', () =>
  db.close(() => {
    console.log('Database closed');
    process.exit(0);
  })
);

module.exports = db;
