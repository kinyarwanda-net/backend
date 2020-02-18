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
}
