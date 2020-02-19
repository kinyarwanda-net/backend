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
    private wordClass: string | null,
    private nounClass: number | null,
    private verified: boolean,
    private hasMedia: number | null,
    private orderBy: number | null,
    private rawQuery: string,
  ) { }

  static async parse (string: string) {
    // Capture and remove all query parameters, pattern is what is left
    this.parsedParams = {};
    const pattern = string.toLowerCase().trim();

    if (new RegExp('(\w+):\s*(\w+)').test(pattern)) {
      const testedPattern = pattern.split(':') as string[];
      this.parsedParams[testedPattern[0]] = testedPattern[1];
    }

    // If pattern starts or ends with an * then we should do a partial match
    const partialMatch = pattern.startsWith('*') || pattern.endsWith('*');

    // Get named query parameters
    const lang = this.readParameter('lang');

    const wordClass = this.readParameter('wclass');

    const nounClass = parseInt(this.readParameter('nclass'), 10) === 0 ? null : parseInt(this.readParameter('nclass'), 10);

    const verified = parseBool(this.readParameter('verified'));

    const has: string = this.readParameter('has')?.toUpperCase();
    const hasMedia = has in Media ? parseInt((<any>Media)[has], 10) : null;

    const order = this.readParameter('order')?.toUpperCase();
    const orderBy = order in OrderBy ? parseInt((<any>OrderBy)[order], 10) : null;

    const match = this.readParameter('match');
    let relationship: Relationship | null = null;

    if (match) {
      relationship = await Dictionary.getTagService().getRelationshipByName(match);
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

  /**
	 * Reads a parameter from the query
	 * @param string name the name of the parameter
	 * @param string defaultTo the default value
	 * @return string the parameter value
	 */
  private static readParameter(name: string, defaultTo = null): string {
    return this.parsedParams[name] ? this.parsedParams[name] : defaultTo;
  }

  /**
	 * Sets the pattern
	 */
  setPattern(pattern: string) {
    this.pattern = pattern;
  }

  /**
	 * Gets the pattern
	 */
  getPattern() {
    return this.pattern;
  }

  /**
	 * Gets the relationship
	 * @return Relationship the relationship
	 */
  getRelationship(): Relationship | null {
    return this.relationship;
  }

  /**
	 * Gets if query is for a partial match
	 * @return bool TRUE if is partial match, else FALSE
	 */
  isPartialMatch(): boolean | null {
    return this.partialMatch;
  }

  /**
	 * Gets the order by
	 * @return int the order by
	 */
  getOrderBy(): number | null {
    return this.orderBy;
  }

  /**
	 * Gets the language code
	 * @return string the language code
	 */
  getLang() {
    return this.lang;
  }

  /**
	 * Gets the noun class to match
	 * @return int the noun class
	 */
  getNounClass() {
    return this.nounClass;
  }

  /**
	 * Gets the word class to match
	 * @return string the word class
	 */
  getWordClass() {
    return this.wordClass;
  }

  /**
	 * Gets the verified requirement
	 * @return bool the verified requirement
	 */
  getVerified() {
    return this.verified;
  }

  /**
	 * Gets the media requirement
	 * @return int the media type
	 */
  getHasMedia() {
    return this.hasMedia;
  }
}
