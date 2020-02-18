import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import routes from './api/routes';
import { Database } from './inc/Database';

dotenv.config();

const app = express();

const db = Database.getInstance();

app
  .use(express.json())
  .use(cors())
  .use(morgan('dev'));

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).send({
    status: 404,
    error: 'Resource not found',
  });
});

const port = process.env.PORT || 5000;

db.connection.connect((err: any) => {
  if (!err) {
    console.log('Database connection successful.');
    app.listen(port, () => console.log(`Server listening on port ${port}`));
  } else {
    console.log(err);
  }
});

export default app;
