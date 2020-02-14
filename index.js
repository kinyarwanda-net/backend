import express from 'express';
import 'dotenv/config';
import router from './routes/app';

const app = express();

app.use(express.json({ extended: false }));

app.use(router);
app.use((req, res) =>{
  res.status(404).send({
    status: 404,
    error: 'Resource not found'
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`The server started and is listen on ${port}`));

export default app;