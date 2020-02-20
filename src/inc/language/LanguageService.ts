import { Service } from '../../inc/Service';
import { Constants } from '../../config';
import { Language } from './Language';

/**
 * Gets all languages
 * @param bool withTranslation include only languages with a site translation
 * @param bool withLexical include only languages with a lexical module
 * @return array the languages
 */
export class LanguageService extends Service {
  getLanguages(withTranslation = null, withLexical: boolean | null = null, callback: Function) {
    let sql = `SELECT L.* FROM ${Constants.KUMVA_DB_PREFIX}language l WHERE 1=1`;
    if (withTranslation) {
      sql += ' AND l.hastranslation = 1 ';
    }
    if (withLexical) {
      sql += 'AND l.haslexical = 1 ';
    }

    sql += 'ORDER BY name';

    this.database.connection.query(sql, (err, results) => {
      if (!err && results) {
        callback(Language.fromQuery(results[0]));
      } else {
        callback(err);
      }
    });
  }

  getLexicalLanguages(codesOnly = false, callback: Function) {
    this.getLanguages(null, true, (err: any, result: any) => {
      const languages = Language.fromQuery(result);
      if (!err && languages) {
        if (!codesOnly) {
          callback(false, languages);
        } else {
          const langs: string[] = languages.map((language) => {
            return language.getCode();
          });
          callback(false, langs);
        }
      } else {
        // TODO: Remove else clause
        console.log('getLexicalLanguages(): ', err);
      }
    });
  }
}
