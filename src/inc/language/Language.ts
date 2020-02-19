import { Entity } from '../../lib/Entity';

export class Language extends Entity {
  /**
	 * Constructs a language
	 * @param int id the id
	 * @param string code the language code
	 * @param string name the name
	 * @param string localName the local name
	 * @param string queryUrl the URL for lookups of this language
	 * @param bool hasTranslation has a site translation file
	 * @param bool hasLexical has a lexical script file
	 */
  constructor (
    protected id: number,
    private code: string,
    private name: string,
    private localName: string,
    private queryUrl: string,
    private hasTranslation: boolean,
    private hasLexical: boolean,
  ) {
    super(id);
  }

  static fromQuery(rows: any[]) {
    return rows.map((row: any) => this.fromRow(row));
  }

  /**
	 * Creates a tag from the given row of database columns
	 * @param array the associative array
	 * @return Tag the tag
	 */
  static fromRow(row: any): Language {
    return new Language(row['language_id'], row['code'], row['name'], row['localname'], row['queryurl'], row['hastranslation'], row['haslexical']);
  }

  /**
	 * Gets the code, e.g. 'en'
	 * @return string the code
	 */
  getCode(): string {
    return this.code;
  }
}
