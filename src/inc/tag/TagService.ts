import { Service } from '../Service';
import { Constants } from '../../config';
import { Relationship } from './Relationship';

export class TagService extends Service {
  private connection = this.database.connection;

  /**
	 * Gets the relationship with the given name
	 * @param string name the relationship name
	 * @return Relationship the relationship
	 */
  async getRelationshipByName(name: string) {
    const sql = `SELECT * FROM ${Constants.KUMVA_DB_PREFIX}relationship WHERE name = ${this.database.escape(name)}`;
    return await this.database.query(sql);

    // this.connection.query(sql, (error, results, fields) => {
    //   if (!error && results[0]) {
    //     callback(false, Relationship.fromRow(results[0]));
    //   } else {
    //     callback(error);
    //   }
    // });
  }

  /**
	 * Gets all the relationships
	 * @param bool matchDefault TRUE to include only those relationships which are matched by default during searching
	 * @return array the relationships
	 */
  async getRelationships(matchDefault = false) {
    let sql = `SELECT * FROM ${Constants.KUMVA_DB_PREFIX}relationship `;
    if (matchDefault) {
      sql += 'WHERE matchDefault = 1 ';
    }
    sql += 'ORDER BY relationship_id';

    const results = await this.database.query(sql);
    return results;

    // this.connection.query(sql, (err, results, fields) => {
    //   if (!err && results) {
    //     // TODO: Implement fromQuery method located in Entity class
    //     callback(false, results[0]);
    //   } else {
    //     callback(err);
    //   }
    // });
  }
}
