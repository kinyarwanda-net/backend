import { Entity } from '../../lib/Entity';

export class Meaning extends Entity {

  /**
	 * Constructs an example
	 * @param int id the id
	 * @param string meaning the meaning
	 * @param number flags the flags
	 */
  constructor(
    protected id: number,
    private meaning: string = '',
    private flags: number = 0,
    ) {
    super(id);
  }

  /**
	 * Creates an meaning from the given row of database columns
	 * @param array the associative array
	 * @return Meaning the meaning
	 */
  static fromRow(row: any) {
    return new Meaning(row['meaning_id'], row['meaning'], row['flags']);
  }

  /**
	 * Gets the meaning
	 * @return string the meaning
	 */
  getMeaning() {
    return this.meaning;
  }
}
