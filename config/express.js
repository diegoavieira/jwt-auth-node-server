const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const cors = require('cors');
const database = require('./database');
const { authRoutes } = require('../routes');

const SECRET = 'VERY_SECRET_KEY';

const passportOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET
};

app.set('port', 5200);
app.set('secret', SECRET);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

app.use((req, res, next) => {
  req.db = database;
  next();
});

passport.use(
  new JwtStrategy(passportOpts, (jwtPayload, done) => {
    const expirationDate = new Date(jwtPayload.exp * 1000);

    if (expirationDate < new Date()) {
      return done(null, false);
    }

    done(null, jwtPayload);
  })
);

passport.serializeUser((user, done) => {
  done(null, user.username);
});

const authenticate = passport.authenticate('jwt');

// routes
authRoutes(app, authenticate);

app.use('*', (req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} does not exists` });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;
