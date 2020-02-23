const jwt = require('jsonwebtoken');
const randtoken = require('rand-token');
const { UserModel } = require('../models');

const controller = {};
const refreshTokens = {};

controller.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await new UserModel(req.db).findByNameAndPassword(
    username,
    password
  );

  if (user) {
    const token = jwt.sign(user, req.app.get('secret'), {
      expiresIn: 30 //seconds
    });

    const refreshToken = randtoken.uid(256);

    refreshTokens[refreshToken] = username;
    res.json({ access_token: token, refresh_token: refreshToken });
  } else {
    res.status(401).json({ message: `Authentication failed` });
  }
};

controller.logout = async (req, res) => {
  const refreshToken = req.body.refresh_token;

  if (refreshToken in refreshTokens) {
    delete refreshTokens[refreshToken];
  }

  res.sendStatus(204);
};

module.exports = controller;
