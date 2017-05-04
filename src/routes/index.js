import express from 'express';
import config from '../config';
import middleware from '../middleware';
import initializeDb from '../db';
import foodtruck from '../controller/foodtruck';
import account from '../controller/account';

let router = express();

initializeDb(db => {
  router.use(middleware({ config, db }));

  router.use('/foodtruck', foodtruck({ config, db }));
  router.use('/account', account({ config, db }));

});

export default router;
