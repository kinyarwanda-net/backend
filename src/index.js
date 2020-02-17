import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

import api from './api/routes';
import db from './config/db';

// Load environment variables
dotenv.config();

const app = express();

app
  .use(express.json())
  .use(cors())
  .use(morgan('dev'));

app.use('/api', api);

app.use((req, res) =>{
  res.status(404).send({
    status: 404,
    error: 'Resource not found'
  });
});

const port = process.env.PORT || 5000;

db.connect((err) => {
  if (!err) {
    console.log('Database connection successful.');
    app.listen(port, () => console.log(`Server listening on port ${port}`));
  } else {
    console.log(err);
  }
})


export default app;
