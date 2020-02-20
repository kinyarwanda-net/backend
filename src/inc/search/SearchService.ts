import { OrderBy, Query } from './Query';
import { Service } from '../../inc/Service';
import { Dictionary } from '../../inc/Dictionary';

/**
 * Search functions
 */
export class SearchService extends Service {
  /**
	 * Searches for all entries that match the given search criteria
	 * @param Query the query
	 * @param int type the search type
	 * @param Paging paging the paging object
	 * @return array the matching revisions
	 */
  search (query: Query, type, orderby = OrderBy.ENTRY) {
    // TODO: Implement authenticated user search with proposals

    const pattern = query.getPattern();

    // Search specific relationships or default to [meaning, form, or variant]
    let relationships = null;
    if (query.getRelationship()) {
      relationships = [query.getRelationship()];
    } else {
      Dictionary.getTagService().getRelationships(true, (err: any, result: any) => {
        if (!err && result) {
          relationships = result;
        } else {
          // TODO: To be removed
          console.log('search()', err);
        }
      });
    }

    // Search specific tag language or all configured tag languages?
    let langs = null;
    if (query.getLang()) {
      langs = [query.getLang()];
    } else {
      Dictionary.getLanguageService().getLexicalLanguages(true, (err: any, results: any[]) => {
        if (!err && results) {
          langs = results;

          // TODO: Build sql query
          let sql = ``;
        }
      });
    }
  }
}
