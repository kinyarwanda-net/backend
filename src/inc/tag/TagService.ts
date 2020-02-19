import { Database } from '../../config/Database';
import { Service } from '../Service';
import { Constants } from '../../config';
import prepSqlVal from '../../lib/prepSqlVal';
import { Relationship } from './Relationship';

export class TagService extends Service {
  private connection = this.database.connection;

  /**
	 * Gets the relationship with the given name
	 * @param string name the relationship name
	 * @return Relationship the relationship
	 */
  getRelationshipByName(name: string, callback: any) {
    const sql = `SELECT * FROM ${Constants.KUMVA_DB_PREFIX}relationship WHERE name = ${prepSqlVal(name)}`;
    this.connection.query(sql, (error, results, fields) => {
      if (!error && results[0]) {
        callback(false, Relationship.fromRow(results[0]));
      } else {
        callback(error);
      }
    });
  }
}
