import { OrderBy, Query } from './Query';
import { Dictionary } from '../../inc/Dictionary';
import { Constants } from '../../config';
import { Lexical } from '../../inc/language/Lexical';

export enum SearchType {
  FORM = 0,
  STEM = 1,
  SOUND = 2,

  // strings = ['form', 'stem', 'sound'],
}

interface ISearch {
  // dictionary: any;
  query: any;
  defaultOrderBy: number;
  results: any;
  iteration: any;
  suggestion: any;
  time: number;
}

/**
 * Class to represent a full dictionary search
 */
class Search implements ISearch {
  // public dictionary;
  public query: Query | null | undefined = null;
  public defaultOrderBy: number = OrderBy.ENTRY;
  public results: any[] | null | undefined = null;
  public iteration: number = 0;
  public suggestion: any = {};
  public time = 0;

  // Minimum length of query patterns on which to perform a smart search
  MIN_SMART_QUERY_LEN = 4;

  /**
	 * Runs the search
	 * @param string source the source of this query, e.g. 'os' for opensearch plugin
	 * @return array the array of revisions found
	 */
  async run(source: string | null = null) {
    // TODO: Implement search logging

    const initSearchType = this.query?.isPartialMatch() ? SearchType.FORM : SearchType.STEM;
    const orderBy = this.query?.getOrderBy() ? this.query?.getOrderBy() : this.defaultOrderBy;

    this.results = this.query ? await Dictionary.getSearchService().search(this.query, initSearchType, orderBy) : null;
    this.iteration = 1;

    // Only do smart search if this is not a partial match, we didn't find anything yet, and the pattern is long enough
    const doSmartSearch = this.query
    ? !this.query.isPartialMatch() && this.results && (this.query.getPattern().length >= this.MIN_SMART_QUERY_LEN)
    : false;

    if (doSmartSearch && this.hasResults()) {
      // Do sounds-like search
      this.results = this.query ? await Dictionary.getSearchService().search(this.query, SearchType.SOUND, orderBy) : null;
      this.iteration = 2;

      // If that fails to find results then perform suggestions search
      if (!this.hasResults()) {
        // Clone query object to create suggestion query
        this.suggestion = { ...this.query } as Query;

        // Create suggestions based on query language
        const suggestionsLang = this.query ? this.query.getLang() : Constants.KUMVA_LANG_DEFS;
        const suggestions: any[] = this.query ? Lexical.suggestions(suggestionsLang, this.query.getPattern()) : [];

        suggestions.forEach(async (suggestion) => {
          this.suggestion.setPattern(suggestion);

          this.results = await Dictionary.getSearchService().search(this.suggestion, SearchType.STEM, orderBy);
          this.iteration = 3;
        });
      }
    }
  }

  /**
	 * Gets whether search returned any results
	 */
  hasResults() {
    return this.results && (this.results.length > 0);
  }

  /**
	 * Gets the results as array of revisions
	 */
  getResults() {
    return this.results;
  }
}

/**
 * Creates a search object
 * @param string string the search string
 * @param Paging paging the paging object
 */
export async function creatSearchClassAsync(searchString: string): Promise<Search> {
  const search = new Search();

  search.query = await Query.parse(searchString);
  // If the user has specified a pattern and not a match relationship then default to relevance ordering
  search.defaultOrderBy = search.query.getPattern() && !search.query.getRelationship() ? OrderBy.RELEVANCE : OrderBy.ENTRY;

  return search;
}
