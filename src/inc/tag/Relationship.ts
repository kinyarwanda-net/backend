import { Entity } from '../../lib/Entity';

export class Relationship extends Entity {

  /**
	 * Constructs a relationship
	 * @param int id the id
	 * @param string name the name, e.g. 'form'
	 * @param string title the title, e.g. 'Form'
	 * @param string description the description
	 * @param bool system TRUE if this is a system type
	 * @param bool matchDefault TRUE if tags of this relationship are matched by default
	 * @param string defaultLang the default language code, e.g. 'rw'
	 */
  constructor(
    id: number,
    private name: string,
    private title: string,
    private description: string,
    private system: boolean,
    private matchDefault: boolean,
    private defaultLang: string,
  ) {
    super(id);
  }

  static fromQuery(rows: any[]) {
    return rows.map(row => this.fromRow(row));
  }

  /**
	 * Creates a relationship from the given row of database columns
	 * @param row Result object
	 * @return Relationship the relationship
	 */
  static fromRow(row: any) {
    return new Relationship(
      row['relationship_id'],
      row['name'],
      row['title'],
      row['description'],
      row['system'],
      row['matchdefault'],
      row['defaultlang'],
    );
  }
}
