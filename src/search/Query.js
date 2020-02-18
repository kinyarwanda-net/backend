export const OrderBy = {
  ENTRY: 0,
  STEM: 1,
  RELEVANCE: 2,
  // strings: ['entry', 'stem', 'relevance'];
}

export class Query {
  pattern = null;

  constructor (pattern) {
    this.pattern = pattern;
  }

  getPattern () {
    return this.getPattern;
  }
}
