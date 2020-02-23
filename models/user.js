const userConverter = row => {
  delete row.password;
  return row;
};

class UserModel {
  constructor(db) {
    this._db = db;
  }

  findByNameAndPassword(usename, password) {
    return new Promise((resolve, reject) =>
      this._db.get(
        `SELECT * FROM user WHERE username = ? AND password = ?`,
        [usename, password],
        (err, row) => {
          if (err) {
            console.log(err);
            return reject('Can`t find user');
          }

          if (row) resolve(userConverter(row));
          resolve(null);
        }
      )
    );
  }

  findByName(usename) {
    return new Promise((resolve, reject) =>
      this._db.get(
        `SELECT * FROM user WHERE username = ?`,
        [usename],
        (err, row) => {
          if (err) {
            console.log(err);
            return reject('Can`t find user');
          }

          if (row) resolve(userConverter(row));
          resolve(null);
        }
      )
    );
  }

  add(user) {
    return new Promise((resolve, reject) => {
      this._db.run(
        `
          INSERT INTO user (
            username,
            full_name,
            last_name,
            email,
            password
          ) values (?,?,?,?,?)
        `,
        [user.usename, user.fullName, user.lastName, user.email, user.password],
        function(err) {
          if (err) {
            console.log(err);
            return reject('Can`t register new user');
          }

          console.log(`User ${user.usename} registered!`);
          resolve();
        }
      );
    });
  }
}

module.exports = UserModel;
