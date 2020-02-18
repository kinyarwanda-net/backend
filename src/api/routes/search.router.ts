import { Router } from 'express';

import searchController from '../controllers/search.controller';

const searchRouter = Router();
const { search } = searchController;

searchRouter.post('/', search);

export default searchRouter;
