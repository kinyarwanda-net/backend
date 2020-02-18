import mysql, { ConnectionConfig, Connection } from 'mysql';

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

  static getInstance() {
    return new Database(
      Number(process.env.DB_PORT),
      process.env.DB_HOST as string,
      process.env.DB_USER as string,
      process.env.DB_PASSWORD as string,
      process.env.DB_NAME as string,
    );
  }
}
