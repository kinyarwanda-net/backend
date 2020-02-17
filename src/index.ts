import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import routes from './api/routes';

dotenv.config();

const app = express();

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

app.listen(port, () => console.log(`Server listening on port ${port}`));

export default app;
