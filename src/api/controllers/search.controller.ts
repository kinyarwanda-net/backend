import { Request, Response } from 'express';

class SearchController {
  constructor() {}

  async search(req: Request, res: Response) {
    const { q: query } = req.query;

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
