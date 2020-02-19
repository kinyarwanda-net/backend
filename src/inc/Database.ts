import mysql, { ConnectionConfig, Connection } from 'mysql';
import { Entity } from '../lib/Entity';

export class Database {
  public connection: Connection;
  private mysqlConfig: ConnectionConfig;

  constructor (
    private readonly port: number,
    private readonly host: string,
    private readonly user: string,
    private readonly password: string,
    private readonly database: string,
  ) {
    this.mysqlConfig = {
      port: this.port,
      host: this.host,
      user: this.user,
      password: this.password,
      database: this.database,
    };

    this.connection = mysql.createConnection(this.mysqlConfig);
  }

  escape(val: any) {
    if (!val) {
      return 'NULL';
    }

    if (Number(val)) {
      return val;
    }

    // TODO: Write entity abtract class
    if (val instanceof Entity) {
      return val.getId();
    }

    return `${this.connection.escape(val)}`;
  }

  query(sql: string): Promise<any | any[]> {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, (err: any, results: any[]) => {
        if (!err && results) {
          resolve(results[0]);
        } else {
          reject(err);
        }
      });
    });
  }

  static getInstance(): Database {
    return new Database(
      Number(process.env.DB_PORT),
      process.env.DB_HOST as string,
      process.env.DB_USER as string,
      process.env.DB_PASSWORD as string,
      process.env.DB_NAME as string,
    );
  }
}
