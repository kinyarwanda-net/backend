import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

import api from './api/routes';

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

app.listen(port, () => console.log(`The server started and is listening on ${port}`));

export default app;
