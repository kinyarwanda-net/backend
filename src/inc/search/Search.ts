import { OrderBy, Query } from './Query';
import { Dictionary } from '../../inc/Dictionary';

export enum SearchType {
  FORM = 0,
  STEM = 1,
  SOUND = 2,

  // strings = ['form', 'stem', 'sound'],
}

/**
 * Class to represent a full dictionary search
 */
export class Search {
  private dictionary;
  private query: Query;
  private defaultOrderBy: number = OrderBy.ENTRY;
  private results = null;
  private iteration;
  private suggestion = null;
  private time = 0;

  // Minimum length of query patterns on which to perform a smart search
  MIN_SMART_QUERY_LEN = 4;

  /**
	 * Creates a search object
	 * @param string string the search string
	 * @param Paging paging the paging object
	 */
  constructor(searchString: string) {
    this.query = Query.parse(searchString);
    // TODO: Implement paging

    // If the user has specified a pattern and not a match relationship then default to relevance ordering
    this.defaultOrderBy = this.query.getPattern() && !this.query.getRelationship()
      ? OrderBy.RELEVANCE
      : OrderBy.ENTRY;
  }

  /**
	 * Runs the search
	 * @param string source the source of this query, e.g. 'os' for opensearch plugin
	 * @return array the array of revisions found
	 */
  run(source: string | null = null) {
    // TODO: Implement search logging

    const initSearchType = this.query.isPartialMatch() ? SearchType.FORM : SearchType.STEM;
    const orderBy = this.query.getOrderBy() ? this.query.getOrderBy() : this.defaultOrderBy;

    this.results = Dictionary.getSearchService().search();
}
