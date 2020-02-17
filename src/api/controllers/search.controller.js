
class SearchController {
  constructor() {}

  async search(req, res) {
    const { q } = req.query;
    return res.status(200).json({ status: "ok", keyword: q });
  }
}

const searchController = new SearchController();
export default searchController;
