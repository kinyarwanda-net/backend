import { Database } from '../inc/Database';
import { Entity } from './Entity';

export default (val: any) => {
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

  return `${Database.getInstance().connection.escape(val)}`;
};
