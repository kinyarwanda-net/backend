import express from 'express';

import searchRouter from '../routes/search.router';

const api = express();

api.use('/search', searchRouter)

export default api;
