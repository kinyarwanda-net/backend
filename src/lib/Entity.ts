export abstract class Entity {
  protected id: number;

  /**
	 * Constructs a new entity
	 * @param int the id
	 */
  constructor(id: number) {
    this.id = id;
  }

  /**
	 * Gets the id
	 * @return int the id
	 */
  getId () {
    return this.id;
  }

  /**
	 * Creates an array of entities from a database query
	 * @param resource result the database query result
	 * @return array the entities
	 */
  static fromQuery(rows: any[]) {
    return rows.map((row: any) => this.fromRow(row));
  }

  static fromRow(row: any): Entity {
    return {} as Entity;
  }
}
