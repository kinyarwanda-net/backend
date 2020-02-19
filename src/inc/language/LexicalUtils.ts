import { stringObj } from '../../lib/porterToStemmer';

export class LexicalUtils {
  private static punctuation = ['-', ',', "'", ' ', '"', '!', '.', '?', '`'];

  /**
	 * Replaces the a suffix if it occurs at the end of the given word
	 * @param string text the text
	 * @param string existing the existing suffix
	 * @param string newSuffix the new suffix
	 * @retutn string the new text
	 */
  static replaceSuffix (text: string, existing: string, newSuffix: string) {
    if (text.endsWith(existing)) {
      return `${text.substring(0, (text.length - existing.length))}${newSuffix}`;
    }
    return text;
  }

  /**
	 * Strips punctuation characters from a string
	 * @param string text the text
	 * @return string the text without punctuation
	 */
  static stripPunctuation(text: string) {
    for (let i = 0; i < this.punctuation.length; i += 1) {
      text.replace(new RegExp(this.punctuation[i], 'g'), '');
    }

    return text;
  }

  /**
	 * Sound maps a string
	 * @param string text the text
	 * @param stringObj maps the object to map with
	 * @return string the sound mapped text
	 */
  static applySoundmap(text: string, maps: stringObj) {
    for (const pattern in maps) {
      text.replace(new RegExp(`${pattern}`), maps[pattern]);
    }
    return text;
  }

  /**
	 * Removes the given suffixes from a word if they are found
	 * @param string text the text
	 * @param array the suffixes
	 * @retutn string the new text
	 */
  static removeSuffixes(text: string, suffixes: string[]) {
    suffixes.forEach((suffix) => {
      if (text.endsWith(suffix)) {
        return text.substring(0, (text.length - suffix.length));
      }
    });
    return text;
  }

  /**
	 * Removes the initial vowel of a string if its sufficently long
	 * @param string text the text
	 * @param int minLen the minimum length of text that will be modified
	 * @retutn string the new text
	 */
  static removeInitialVowel(text: string, minLen = 3) {
    if (text.length >= minLen && this.isVowel(text[0])) {
      return text.substring(1);
    }
    return text;
  }

  /**
	 * Removes the final vowel of a string if its sufficently long
	 * @param string text the text
	 * @param int minLen the minimum length of text that will be modified
	 * @retutn string the new text
	 */
  static removeFinalVowel(text: string, minLen = 3) {
    if (text.length >= minLen && this.isVowel(text[text.length - 1])) {
      return text.substring(0, text.length - 1);
    }
    return text;
  }

  /**
	 * Gets whether the given character is a vowel
	 * @param string char the character to check
	 * @return bool TRUE if character is a vowel
	 */
  static isVowel(char: string) {
    const passedChar = char.toUpperCase();
    return passedChar === 'A' || passedChar === 'E' || passedChar === 'I' || passedChar === 'O' || passedChar === 'U';
  }
}
