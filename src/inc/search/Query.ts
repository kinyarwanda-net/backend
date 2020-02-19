import parseBool from '../../lib/parseBool';
import { Media } from '../entry/Entry';
import { Dictionary } from '../../inc/Dictionary';
import { Relationship } from '../../inc/tag/Relationship';

export enum OrderBy {
  ENTRY = 0,
  STEM = 1,
  RELEVANCE = 2,

  // strings = ['entry', 'stem', 'relevance']
}

export class Query {
  private static parsedParams: any;

  constructor (
    private pattern: string,
    private lang: string,
    private relationship: Relationship | null,
    private partialMatch: boolean | null = null,
    private wordClass: string,
    private nounClass: number | null,
    private verified: boolean,
    private hasMedia: number | null,
    private orderBy: number | null,
    private rawQuery: string,
  ) { }

  static parse (string: string) {
    // Capture and remove all query parameters, pattern is what is left
    this.parsedParams = {};
    const pattern = string.toLowerCase().trim();

    if (RegExp('(\w+):\s*(\w+)').test(pattern)) {
      const testedPattern = pattern.split(':') as string[];
      this.parsedParams[testedPattern[0]] = testedPattern[1];
    }

    // If pattern starts or ends with an * then we should do a partial match
    const partialMatch = pattern.startsWith('*') || pattern.endsWith('*');

    // Get named query parameters
    const lang = this.readParameter('lang');

    const wordClass = this.readParameter('wclass');

    const nounClass = this.readParameter('nclass') === 0 ? null : this.readParameter('nclass');

    const verified = parseBool(this.readParameter('verified'));

    const has = this.readParameter('has').toUpperCase();
    const hasMedia = has in Media ? parseInt(Media[has], 10) : null;

    const order = this.readParameter('order').toUpperCase();
    const orderBy = order in OrderBy ? parseInt(OrderBy[order], 10) : null;

    const match = this.readParameter('match');
    let relationship: Relationship | null = null;
    if (match) {
      Dictionary
        .getTagService()
        .getRelationshipByName(match, (err: any, result: any) => {
          if (!err && result) {
            relationship = result;
          }
        });
    }

    return new Query(
      pattern,
      lang,
      relationship,
      partialMatch,
      wordClass,
      nounClass,
      verified,
      hasMedia,
      orderBy,
      string,
    );
  }

  private static readParameter(name: string, defaultTo = null) {
    return this.parsedParams[name] ? this.parsedParams[name] : defaultTo;
  }

  getPattern () {
    return this.pattern;
  }
}
