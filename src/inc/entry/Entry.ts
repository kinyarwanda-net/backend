import { Entity } from '../../lib/Entity';

export enum Media {
  AUDIO = 0,
  IMAGE = 1,
}

export class Entry extends Entity {
  // private head;
  // private revisions;

  /**
	 * Constructs an entry
	 * @param int id the id
	 * @param int media the media flags
	 */
  constructor (
    id: number = 0,
    private media: number = 0,
  ) {
    super(id);
  }

  static fromQuery(rows: any[]) {
    return rows.map((row: any) => this.fromRow(row));
  }

  /**
	 * Creates an entry from the given row of database columns
	 * @param array the associative array
	 * @return Entry the entry
	 */
  static fromRow(row: any) {
    return new Entry(row['entry_id'], row['media']);
  }

  /**
	 * Gets the media flags
	 * @return int the media flags
	 */
  getMedia() {
    return this.media;
  }

  /**
   * Sets the media flags
   * @param int media the media flags
   */
  setMedia(media: number) {
    this.media = media;
  }
}
