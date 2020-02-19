import { OrderBy, Query } from './Query';
import { Service } from '../../inc/Service';
import { Dictionary } from '../../inc/Dictionary';
import { Constants } from '../../config';
import { SearchType } from './Search';
import { Lexical } from '../../inc/language/Lexical';
import { Relationship } from '../../inc/tag/Relationship';
import { Entry } from '../../inc/entry/Entry';

const {
  KUMVA_DB_PREFIX,
} = Constants;

/**
 * Search functions
 */
export class SearchService extends Service {
  /**
	 * Searches for all entries that match the given search criteria
	 * @param Query the query
	 * @param int type the search type
	 * @param Paging paging the paging object
	 * @return array the matching revisions
	 */
  async search(query: Query, type: SearchType, orderBy: number | null = OrderBy.ENTRY) {
    // TODO: Implement authenticated user search with proposals and update sql query accordingly
    const pattern = query.getPattern();

    // Search specific relationships or default to [meaning, form, or variant]
    let relationships: any[];
    if (query.getRelationship()) {
      relationships = [query.getRelationship()];
    } else {
      relationships = await Dictionary.getTagService().getRelationships(true);
    }

    // Search specific tag language or all configured tag languages?
    let langs = null;
    if (query.getLang()) {
      langs = [query.getLang()];
    } else {
      langs = await Dictionary.getLanguageService().getLexicalLanguages(true);

      let sql = `SELECT SQL_CALC_FOUND_ROWS e.*, CONCAT(COALESCE(r.prefix, ''), r.lemma) as entry
            FROM ${KUMVA_DB_PREFIX}entry e
            INNER JOIN ${KUMVA_DB_PREFIX}revision r ON r.entry_id = e.entry_id AND r.status = 1
            INNER JOIN (SELECT rt.revision_id, MAX(rt.weight) as maxtagweight
            FROM ${KUMVA_DB_PREFIX}revision_tag rt
            INNER JOIN ${KUMVA_DB_PREFIX}tag t
            ON rt.tag_id = t.tag_id`;

      const tagCriteria = [];
      langs.forEach((lang: any) => {
        const escapedLang = this.database.escape(lang);

        if (pattern) {
          switch (type) {
            case SearchType.FORM:
              const text = this.database.escape(pattern.replace(/\*/g, '%'));
              const patternOp = query.isPartialMatch() ? 'LIKE' : '=';
              tagCriteria.push(`t.lang = ${escapedLang} AND t.text ${patternOp} ${text}`);
              break;

            case SearchType.STEM:
              const stem = this.database.escape(Lexical.stem(lang, pattern));
              tagCriteria.push(`(t.lang = ${escapedLang} AND t.stem = ${stem})`);
              break;

            case SearchType.SOUND:
              const sound = this.database.escape(Lexical.sound(lang, pattern));
              tagCriteria.push(`(t.lang = ${escapedLang} AND t.sound = ${sound})`);
              break;
          }
        } else {
          tagCriteria.push(`(t.lang = ${escapedLang})`);
        }
      });

          // Add a language agnostic match for stem searches with no explicit language
      if (type === SearchType.STEM && !query.getLang()) {
        const text = this.database.escape(pattern);
        tagCriteria.push(`t.text = ${text}`);
      }

      const tagDefCriteria: any[] = [];
      relationships.forEach((relationship: Relationship) => {
        tagDefCriteria.push(`rt.relationship_id = ${relationship.getId()}`);
      });

      sql += ` WHERE (${tagCriteria.join(' OR ')}) AND (${tagDefCriteria.join(' OR ')})`;
      sql += 'AND rt.active = 1 ';
      sql += '  GROUP BY rt.revision_id ';
      sql += ') m ON m.revision_id = r.revision_id ';

          /** Noun class criteria */
      if (query.getNounClass()) {
        sql += `INNER JOIN ${KUMVA_DB_PREFIX}revision_nounclass rnc
              ON rnc.revision_id = r.revision_id AND rnc.nounclass = ${query.getNounClass()} `;
      }

          /** Revision/entry criteria */
      const defCriteria = [];

          // Filter by wordclass
      if (query.getWordClass()) defCriteria.push(`r.wordclass = ${this.database.escape(query.getWordClass())}`);

          // Filter by verified state
      const verified = query.getVerified();
      if (verified !== null) defCriteria.push(`r.unverified = ${verified ? 0 : 1}`);

          // Filter by media
      const hasMedia = query.getHasMedia();
      if (hasMedia !== null) defCriteria.push(`e.media & ${hasMedia ** 2}`);

      if (defCriteria.length > 0) sql += `WHERE ${defCriteria.join(' AND ')} `;

          /** Order by */
      switch (orderBy) {
        case OrderBy.ENTRY:
          sql += 'ORDER BY `entry` ASC ';
          break;
        case OrderBy.STEM:
          sql += 'ORDER BY r.lemma ASC, r.prefix ASC ';
          break;
        case OrderBy.RELEVANCE:
          sql += 'ORDER BY `maxtagweight` DESC, `entry` ASC ';
          break;
      }

      // Execute query
      const result = await this.database.query(sql);

      return Entry.fromQuery(result);
    }
  }
}
