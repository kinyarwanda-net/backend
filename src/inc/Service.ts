import { Database } from './Database';

/**
 * Base class for services
 */
export class Service {

  /**
	 * Constructs the service
	 * @param Database database the database connection
	 */
  constructor(protected database: Database) {}

}
