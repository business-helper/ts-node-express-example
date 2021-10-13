import express from 'express';

import config from './config';

const app = express();

import { default as indexRouter } from './routes';

app.use('/', indexRouter);

app.listen(config.port, () => {
  console.log(`Timezones by location application is running on port ${config.port}.`);
});