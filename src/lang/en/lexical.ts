import parse from 'csv-parse/lib/sync';

import { Porter2Stemmer, stringObj } from '../../lib/porterToStemmer';
import { LexicalUtils } from '../../inc/language/LexicalUtils';
import { Revision } from '../../inc/entry/Revision';

const kumvaPorter2 = new Porter2Stemmer();

// tslint:disable-next-line: variable-name
const kumvaENsoundmaps: stringObj = {
  ISE: 'IZE',
  ISA: 'IZA',
  OUR: 'OR',
  // tslint:disable-next-line: object-literal-key-quotes
  'TRE\B': 'TER',  // UK > US word endings
  PH: 'F',
  BB: 'B',
  DD: 'D',
  GG: 'G',
  LL:'L',
  MM: 'M',
  NN: 'N',
  PP: 'P',
  SS: 'S',
  TT: 'T',
  SCH: 'SK',
  SC: 'SK',
  CA: 'KA',
  CO: 'KO',
  CU: 'KU',					// C / K equivalence
  X: 'KS',
};

export const languageFunctions = {
  /**
   * Gets the stem of the given English form using the PORTER2 algorithm
   * @param string text the form to stem
   * @return string the stem
   */
  kumva_en_stem: (text: string) => {
    let passedText = text.toLowerCase();

    // Porter stemmer works with US endings, so convert to these
    passedText = LexicalUtils.replaceSuffix(passedText, 'isation', 'ization');
    passedText = LexicalUtils.replaceSuffix(passedText, 'iser', 'izer');
    passedText = LexicalUtils.replaceSuffix(passedText, 'ised', 'ized');
    passedText = LexicalUtils.replaceSuffix(passedText, 'ise', 'ize');

    return kumvaPorter2.stem(passedText);
  },

  /**
   * Gets a sounding representation of the given English form
   * @param string text the form
   * @return string the sounding
   */
  kumva_en_sound: (text: string) => {
    let passedText = text.toUpperCase();

    passedText = LexicalUtils.stripPunctuation(passedText);
    passedText = LexicalUtils.applySoundmap(passedText, kumvaENsoundmaps);

    return passedText;
  },

  /**
   * Returns meaning tag strings for the given revision
   * @param Revision the revision
   * @return array the array of tag strings
   */
  kumva_en_autotag_meaning: async (revision: Revision) => {
    let tags: string[] = [];
    const meanings = await revision.getMeanings();
    meanings.forEach((meaning) => {
      const records = parse(meaning.getMeaning(), { skip_empty_lines: true, columns: true });
      tags = [...tags, ...records];
    });

    if (revision.getWordClass() === 'v') {
      // Strip infinitive prepositions
      for (let i = 0; i < tags.length; i += 1) {
        if (tags[i].startsWith('to ')) tags[i] = tags[i].substring(0, 3);
        if (tags[i].startsWith('be ')) tags[i] = tags[i].substring(0, 3);
      }
    } else if (revision.getWordClass() === 'n') {
      // Strip articles
      for (let i = 0; i < tags.length; i += 1) {
        if (tags[i].startsWith('a ')) tags[i] = tags[i].substring(0, 2);
        if (tags[i].startsWith('the ')) tags[i] = tags[i].substring(0, 4);
      }
    }

    return tags;
  },
};
