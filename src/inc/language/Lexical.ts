import languageFunctions from '../../lang';
import { LexicalUtils } from './LexicalUtils';

/**
 * Lexical utility class
 */
export class Lexical {
  private static punctuation = ['-', ',', "'", ' ', '"', '!', '.', '?', '`'];

  /**
	 * Checks if the give language specific function exists
	 * @param string lang the language code
	 * @param string func the name of the function
	 * @return bool TRUE if function exists, else FALSE
	 */
  static hasLangFunction(lang: string, func: string) {
    return languageFunctions.hasOwnProperty(`kumva_${lang}_${func}`);
  }

  /**
	 * Calls a language specific function
	 * @param string lang the language code
	 * @param string func the name of the function
	 * @param array params the params to pass to the function
	 * @return string the result of the language specific function
	 */
  static callLangFunction(lang: string, func: string, params: any[]) {
    const funcToCall = `kumva_${lang}_${func}`;

    if (languageFunctions.hasOwnProperty(funcToCall)) {
      return languageFunctions[funcToCall](...params);
    }

    return false;
  }

  /**
	 * Gets stem of the given text, in the given language. Defaults to stripping punctuation for unknown languages
	 * @param string lang the language code
	 * @param string text the text to stem
	 * @return string the stemmed text
	 */
  static stem(lang: string, text: string) {
    if (this.hasLangFunction(lang, 'stem')) {
      return this.callLangFunction(lang, 'stem', [text]);
    }

    return LexicalUtils.stripPunctuation(text).toLowerCase();
  }

  /**
	 * Gets sound of the given text. Defaults to stripping punctuation and uppercasing for unknown languages
	 * @param string lang the language code
	 * @param string text the text
	 * @return string the stemmed text
	 */
  static sound(lang: string, text: string) {
    if (this.hasLangFunction(lang, 'sound')) {
      return this.callLangFunction(lang, 'sound', [text]);
    }

    return LexicalUtils.stripPunctuation(text).toUpperCase();
  }

  /**
	 * Gets search suggestions for the given text. Defaults to none (empty array)
	 * @param string lang the language code
	 * @param string text the text
	 * @return array the array of suggestions
	 */
  static suggestions(lang: string, text: string) {
    if (this.hasLangFunction(lang, 'suggestions')) {
      return this.callLangFunction(lang, 'suggestions', [text]);
    }

    return [];
  }
}
