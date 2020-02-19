import { Revision } from '../../inc/entry/Revision';
import { LexicalUtils } from '../../inc/language/LexicalUtils';

const kumvaRWsoundmaps = {
  SHY: 'SH', JY: 'J', CY: 'C',							// Subtle y's
  'N[KT]': 'NH', MH: 'MP',
  '[KG]I': 'JI', '[KG]E': 'JE',									// Soft k's and g's
  GA: 'KA',
  CH: 'J', C: 'J',											// Soft c's
  GU: 'KU', DU: 'TU',											// Change down rule
  NB: 'MB', NF: 'MF', NV: 'MV',							// n > m before labial rule
  RGW: 'GW', RW: 'GW', RY: 'DY',
  BW: 'BG',														// bw sometimes written bg
  KWU: 'KU', KWO: 'KO',										// ku+u and ku+o in different orthographies
  NY: 'N',														// -nyije = -nije
  AA: 'A', EE: 'E', II: 'I', OO: 'O', UU: 'U',	// Double vowels sometimes used to show accentation
  PH: 'F',														// Loan words
  SIT: 'ST',														// e.g. sitade = stade
  KIR: 'KR',														// e.g. umukiristo = umukristo
  R:'L',															//
  '([^AEIOU])[AEIOU]([AEIOU])': '\\1\\2',
};

const kumvaRWsuffixes = ['mo', 'yo', 'ho'];

export const languageFunctions = {
  /**
   * Gets the stem of the given Kinyarwanda form... not really able to do this yet so we just remove punctuation
   * @param string text the text to stem
   * @return string the stem
   */
  kumva_rw_stem: (text: string) => {
    let passedText = text.toLowerCase();
    passedText = LexicalUtils.stripPunctuation(passedText);

    // If its long enough then strip any pronominal suffixes
    if (passedText.length >= 6) {
      passedText = LexicalUtils.removeSuffixes(passedText, kumvaRWsuffixes);
    }

    // Remove final vowel (lets -e verb endings match)
    if (passedText.length >= 4) {
      passedText = LexicalUtils.removeFinalVowel(passedText);
    }

    return passedText;
  },

  /**
   * Gets a sounding representation of the given Kinyarwanda form
   * @param string text the text
   * @return string the sounding
   */
  kumva_rw_sound: (text: string) => {
    let passedText = text.toUpperCase();

    // Strip initial vowel as these are often very short or dropped in Kinyarwanda
    passedText = LexicalUtils.removeInitialVowel(passedText);

    // Remove punctuation and do sound map
    passedText = LexicalUtils.stripPunctuation(passedText);
    passedText = LexicalUtils.applySoundmap(passedText, kumvaRWsoundmaps);

    return passedText;
  },

  /**
   * Gets search suggestions for the given text
   * @param string text the text
   * @return array the array of suggestions
   */
  kumva_rw_suggestions: (text: string) => {
    let passedText = text;
    const suggestions: string[] = [];

    // Remove pronominal suffixes for first suggestion
    kumvaRWsuffixes.forEach((suffix) => {
      if (passedText.endsWith(suffix)) {
        passedText = passedText.substring(0, (passedText.length - suffix.length));
        suggestions.push(passedText);
      }
    });

    // Replace diminutive prefixes aka/utu with other classes
    let stem: string;
    switch (true) {
      case passedText.startsWith('aka'):
        stem = passedText.substring(3);
        suggestions.push(`umu${stem}`);
        suggestions.push(`iki${stem}`);
        suggestions.push(`in${stem}`);
        break;

      case passedText.startsWith('aga'):
        stem = passedText.substring(3);
        suggestions.push(`umu${stem}`);
        suggestions.push(`igi${stem}`);
        suggestions.push(`in${stem}`);
        break;

      case passedText.startsWith('ak'):
        stem = passedText.substring(2);
        suggestions.push(`umw${stem}`);
        suggestions.push(`icy${stem}`);
        suggestions.push(`inz${stem}`);
        break;

      case (passedText.startsWith('utu') || passedText.startsWith('ugu')):
        stem = passedText.substring(3);
        suggestions.push(`aba${stem}`);
        suggestions.push(`imi${stem}`);
        suggestions.push(`ibi${stem}`);
        break;

      case passedText.startsWith('ak'):
        stem = passedText.substring(3);
        suggestions.push(`ab${stem}`);
        suggestions.push(`imy${stem}`);
        suggestions.push(`iby${stem}`);
        break;
    }

    // Strip letters from beginning to create other suggestions
    while (passedText.length > 3) {
      if (passedText[0] !== '-') {
        passedText = `-${passedText}`;  // Append dash
      } else if (passedText[2] === ' ') {
        passedText = `-${passedText.substring(2)}`; // Replace next starting letter with a dash
      } else {
        passedText = passedText.substring(3);
      }

      suggestions.push(passedText);
    }

    return suggestions;
  },

  /**
   * Returns form tag strings for the given revision
   * @param Revision the revision
   * @return array the array of tag strings, e.g. ['gukora', '-kora', '-koze']
   */
  kumva_rw_autotag_form: (revision: Revision) => {
    const forms = [];
    forms.push(`${revision.getPrefix()}${revision.getLemma()}`); // Always prefix+lemma for all word classes

    if (revision.getWordClass() === 'v') {
      forms.push(`-${revision.getLemma()}`);  // Verb present tense / imperative
      forms.push(rwVerbPastTense(revision));  // Verb past tense
    } else if (revision.getWordClass() === 'n') {
      const plural = rwPlural(revision);  // Noun plural

      // Only add if plural form is different to singular
      if (forms[0] !== plural) forms.push(plural);
    }

    return forms;
  },
};

/**
   * Creates the plural form of a noun from the stem and the plural prefix
   */
const rwPlural = (revision: Revision) => {
  const modifier = revision.getModifier();
  if (!modifier.startsWith('-')) return modifier;

  return revision.getLemma().replace(/-/g, modifier);
};

const rwVerbPastTense = (revision: Revision) => {
  const modifier = revision.getModifier();
  if (!modifier.startsWith('-')) return modifier;

  // Verb may have auxillary words
  const words = revision.getLemma().split(' ');
  const verb = words[0];
  words.shift();
  const extra = words.join(' ');
  const stem = rwVerbstem(verb);

  if (stem) {
    const past = modifier.replace(/-/g, stem);
    return `-${past}${extra ? ` ${extra}` : ''}`;
  }

  return revision.getModifier();
};

const rwVerbstem = (verb: string) => {
  let passedText = verb;
  passedText = LexicalUtils.removeSuffixes(passedText, kumvaRWsuffixes);

  for (let c = verb.length - 1; c >= 0; c -= 1) {
    if (!LexicalUtils.isVowel(verb[c])) {
      if (c === 0) return verb.substring(0, c);
      if (LexicalUtils.isVowel(verb[c - 1])) return verb.substring(0, c);
    }
  }

  return null;
};
