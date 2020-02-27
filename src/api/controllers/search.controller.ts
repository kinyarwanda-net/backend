import { Request, Response } from 'express';
import { creatSearchClassAsync } from '../../inc/search/Search';

class SearchController {
  constructor() {}

  async search(req: Request, res: Response) {
    try {
      const { q: query } = req.query;

      const search = await creatSearchClassAsync(query);
      await search.run();

      if (search.hasResults()) {
        console.log('Results', search.getResults());
      }

      const searchResult = {
        query,
        results: [{
          entry: {
            prefix: '',
            lemma: '',
            modifier: '',
            wordclass: '',
            nounclasses: [],
            meanings: [],
          },
        }],
      };

      return res.status(200).json(searchResult);
    } catch (error) {
      console.log('search error: ', error);
    }
  }
}

const searchController = new SearchController();
export default searchController;
