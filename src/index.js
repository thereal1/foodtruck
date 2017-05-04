import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';

import config from './config';
import routes from './routes';
import Account from './model/account';

import { Strategy as LocalStrategy } from 'passport-local';

let app = express();
app.server = http.createServer(app);

app.use(bodyParser.json({
  limit: config.bodyLimit
}));

app.use(passport.initialize());
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  Account.authenticate()
));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

app.use('/v1', routes);

app.server.listen(config.port);
console.log(`Started on port ${app.server.address().port}`);

export default app;
