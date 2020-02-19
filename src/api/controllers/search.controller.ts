import { Request, Response } from 'express';
import { creatSearchClassAsync } from '../../inc/search/Search';

class SearchController {
  constructor() {}

  async search(req: Request, res: Response) {
    const { q: query } = req.query;

    const search = await creatSearchClassAsync(query);
    await search.run();

    console.log('Search Result', search);

    const searchResult = {
      query,
      results: [{
        entry: {
          prefix: 'gu',
          lemma: 'teka',
          modifier: '-tse',
          wordclass: 'v',
          nounclasses: [],
          meanings: ['stop producing milk (cow)', 'finish a harvest'],
        },
      }],
    };

    return res.status(200).json(searchResult);
  }
}

const searchController = new SearchController();
export default searchController;
