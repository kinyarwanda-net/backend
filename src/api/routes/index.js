import express from 'express';

import searchRouter from '../routes/search.router';

const routes = express();

routes.use('/search', searchRouter)

export default routes;
