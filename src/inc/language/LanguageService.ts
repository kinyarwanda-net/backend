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
  async getLanguages(withTranslation = null, withLexical: boolean | null = null) {
    let sql = `SELECT l.* FROM ${Constants.KUMVA_DB_PREFIX}language l WHERE 1=1`;
    if (withTranslation) {
      sql += ' AND l.hastranslation = 1 ';
    }
    if (withLexical) {
      sql += ' AND l.haslexical = 1 ';
    }

    sql += 'ORDER BY name';

    return await this.database.query(sql);
  }

  async getLexicalLanguages(codesOnly = false) {
    const result = await this.getLanguages(null, true);
    const languages = Language.fromQuery(result);

    if (!codesOnly) return languages;

    const langs: string[] = languages.map((language) => {
      return language.getCode();
    });

    return langs;
  }
}
