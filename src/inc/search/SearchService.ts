import db from '../Database';
import { OrderBy } from './Query';

class SearchService {
  constructor() {}

  search (query, type, orderby = OrderBy.ENTRY) {
    const pattern = query.getPattern();
  }
}

const searchService = new SearchService();
export default searchService;
