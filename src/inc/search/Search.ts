import { OrderBy, Query } from './Query';

export enum SearchType {
  FORM = 0,
  STEM = 1,
  SOUND = 2,

  // strings = ['form', 'stem', 'sound'],
}

export class Search {
  private dictionary;
  private query;
  private defaultOrderBy = OrderBy.ENTRY;
  private results = null;
  private iteration;
  private suggestion = null;
  private time = 0;

  // Minimum length of query patterns on which to perform a smart search
  MIN_SMART_QUERY_LEN = 4;

  constructor(searchString: string) {
    this.query = Query.parse(searchString);
  }
}
