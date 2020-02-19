import { Service } from '../../inc/Service';
import { Revision } from './Revision';
import { Constants } from '../../config';
import { Meaning } from './Meaning';

const { KUMVA_DB_PREFIX } = Constants;

export class EntryService extends Service {
  /**
	 * Gets the meanings for the given revision
	 * @param Revision revision the revision
	 * @return array the meanings
	 */
  async getRevisionMeanings(revision: Revision): Promise<Meaning[]> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM ${KUMVA_DB_PREFIX} meaning
      WHERE revision_id = ${revision.getId()}
      ORDER BY order ASC`;

      this.database.connection.query(sql, (err, results) => {
        if (!err && results) {
          resolve(results[0]);
        } else {
          reject(err);
        }
      });
    });
  }
}
