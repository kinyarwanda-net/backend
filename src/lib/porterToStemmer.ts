export type stringObj = { [key: string]: string };

export class Porter2Stemmer {
  static exceptions1: stringObj = {
    skis: 'ski',
    skies: 'sky',
    dying: 'die',
    lying: 'lie',
    tying: 'tie',
    idly: 'idl',
    gently: 'gentl',
    ugly: 'ugli',
    early: 'earli',
    only: 'onli',
    singly: 'singl',
    sky: 'sky',
    news: 'news',
    howe: 'howe',
    atlas: 'atlas',
    cosmos: 'cosmos',
    bias: 'bias',
    andes: 'andes',
  };

  static exceptions2 = ['inning', 'outing', 'canning', 'herring', 'earring', 'proceed', 'exceed', 'succeed'];

  static vowel = '([aeiouy]){1}';

  static consonant = '([bcdfghjklmnpqrstvwxzY]){1}';

  static consonantShort = '([bcdfghjklmnpqrstvz]){1}';

  static double = '((bb)|(dd)|(ff)|(gg)|(mm)|(nn)|(pp)|(rr)|(tt))';

  //region after the first non-vowel following a vowel,
  static r1 = "(?<=([aeiouy]){1}([bcdfghjklmnpqrstvwxzY]){1})[a-zY']*\$";

  static r1Exceptions = "((?<=^commun)|(?<=^gener)|(?<=^arsen))[a-zY']*\$";

  //region after the first non-vowel following a vowel in R1,
  static r2 = "(?<=([aeiouy]){1}([bcdfghjklmnpqrstvwxzY]){1})[a-zY']*\$";

  R1 = '';
  R2 = '';

  stem(word: string) {
    const wordToLower = word.toLowerCase();
    let passedWord = word;

    if (wordToLower.length < 3) {
      return word;
    }

    if (Porter2Stemmer.exceptions1.hasOwnProperty(word)) {
      return Porter2Stemmer.exceptions1[word];
    }

    passedWord = this.markVowels(passedWord);
    passedWord = this.step0(passedWord);
    passedWord = this.step1(passedWord);

    if (!Porter2Stemmer.exceptions2.includes(passedWord)) {
      passedWord = this.step2(passedWord);
      passedWord = this.step3(passedWord);
      passedWord = this.step4(passedWord);
      passedWord = this.step5(passedWord);
    }

    return passedWord.toLowerCase();
  }

  markVowels(word: string) {
    let w = word;
    const c = Porter2Stemmer.consonant;
    const v = Porter2Stemmer.vowel;

    for (let i = 0; i < w.length; i += 1) {
      const char = w[i];
      if (char === 'y' && (i === 0 || (i > 0 && new RegExp(`#${v}#`).test(w[i - 1])))) {
        w = `${w.substr(0, i)}'Y'${w.substr(i + 1)}`;
      }
    }

    this.updateR1R2(w);
    return w;
  }

  /**
	 * Determines if word is short
	 *
	 * @param string $word String to stem
	 * @return boolean
	 */
  isShort(word: string) {
    let consonantRegex = new RegExp(`#^${Porter2Stemmer.consonant}#`);
    this.updateR1R2(word);

    if (!this.R1) {
      if (consonantRegex.test(word)) {
        return true;
      }

      consonantRegex = new RegExp(`#${Porter2Stemmer.consonant}\$#`);

      if (consonantRegex.test(word)) {
        return true;
      }
    }

    return false;
  }

  /**
	 * Updates R1 and R2
	 *
	 * @param string $word String to stem
	 */
  updateR1R2(word: string) {
    let matches: RegExpMatchArray | null;
    const r1ExceptionsRegex = new RegExp(`#${Porter2Stemmer.r1Exceptions}#`);
    const r1Regex = new RegExp(`#${Porter2Stemmer.r1}#`);
    const r2Regex = new RegExp(`#${Porter2Stemmer.r2}#`);

    if (!word.match(r1ExceptionsRegex)) {
      matches = word.match(r1Regex);
      this.R1 = matches ? matches[0] : '';
    }

    matches = this.R1.match(r2Regex);
    this.R2 = matches ? matches[0] : '';
  }

  endsWithShortSyllable(word: string) {
    const consonantRegex = new RegExp(`#${Porter2Stemmer.consonant}#`);
    const consonantShortRegex = new RegExp(`#${Porter2Stemmer.consonantShort}#`);
    const vowelRegex = new RegExp(`#${Porter2Stemmer.vowel}#`);

    if (word.length < 3 && vowelRegex.test(word[0]) && consonantRegex.test(word[1])) {
      return true;
    }

    if (consonantShortRegex.test(word[word.length - 1]) && (vowelRegex.test(word[word.length - 2])
      || word[word.length - 1] === 'y') && consonantRegex.test(word[word.length - 3])) {
      return true;
    }

    return false;
  }

  /**
	 * Step 0
	 *
	 * @param string $word String to stem
	 * @return string
	 */
  step0(word: string) {
    let passedWord = word;
    if (passedWord.startsWith("'")) {
      // Remove prefix if present
      passedWord = passedWord.substring(1);
    }

    const suffixes = ["'s'", "'s", "'"];

    suffixes.forEach((suffix) => {
      if (passedWord.endsWith(suffix)) {
        // Remove suffix if present
        passedWord.substring(0, passedWord.length - suffixes.length);
      }
    });

    return passedWord;
  }

  /**
	 * Step 1
	 *
	 * @param string $word String to stem
	 * @return string
	 */
  step1(word: string) {
    let passedWord = word;
    const consonantRegex = new RegExp(`#${Porter2Stemmer.consonant}#`);
    const vowelRegex = new RegExp(`#${Porter2Stemmer.vowel}#`);

    // Step 1a
    if (passedWord.endsWith('sses')) {
      passedWord = `${passedWord.substring(0, passedWord.length - 4)}ss`;

    } else if (passedWord.endsWith('ied') || passedWord.endsWith('ies')) {
      passedWord = passedWord.substring(0, passedWord.length - 3);

      if (passedWord.length > 1) {
        passedWord += 'i';

      } else {
        passedWord += 'ie';

      }

      // TODO: Verify the following logic. Second AND operator should be and OR ?
    } else if (passedWord.endsWith('s') && (passedWord[passedWord.length - 2] !== 's' && passedWord[passedWord.length - 2] !== 'u')) {
      const part = passedWord.substring(0, passedWord.length - 2);

      if (vowelRegex.test(part)) {
        passedWord = passedWord.substring(0, passedWord.length - 1);
      }
    }

    let found = false;

    if (Porter2Stemmer.exceptions2.includes(passedWord)) {
      return passedWord;
    }

    const suffixes: stringObj = { eedly: 'ee', eed: 'ee' };
    for (const suffix in suffixes) {
      if (passedWord.endsWith(suffix)) {
        found = true;
        if (this.R1.indexOf(suffix) > -1) {
          passedWord = `${passedWord.substring(0, (passedWord.length - suffix.length))}${suffixes[suffix]}`;
        }
      }
    }

    const suffixesArr = ['ingly', 'edly', 'ing', 'ed'];
    const doubleRegex = new RegExp(`#${Porter2Stemmer.double}\$#`);
    if (!found) {
      suffixesArr.forEach((suffix) => {
        if (passedWord.endsWith(suffix) && vowelRegex.test(passedWord.substring(0, (passedWord.length - suffix.length)))) {
          passedWord = passedWord.substring(0, suffix.length);

          if (passedWord[passedWord.length - 2] === 'at' ||
            passedWord[passedWord.length - 2] === 'bl' ||
            passedWord[passedWord.length - 2] === 'iz') {
            passedWord += '2';

          } else if (doubleRegex.test(passedWord)) {
            passedWord = passedWord.substring(0, passedWord.length - 1);

          } else if (this.isShort(passedWord)) {
            passedWord += 'e';

          }
        }
      });
    }

    // Step 1c
    if (passedWord.endsWith('y') || passedWord.endsWith('Y')
      && consonantRegex.test(passedWord[passedWord.length - 2])
      && passedWord.length > 2) {
      passedWord = `${passedWord.substring(0, passedWord.length - 1)}i`;
    }

    return passedWord;
  }

  /**
	 * Step 2
	 *
	 * @param string $word String to stem
	 * @return string
	 */
  step2(word: string) {
    let passedWord = word;
    this.updateR1R2(word);

    const suffixes: stringObj = {
      ization: 'ize',
      fulness: 'ful',
      ousness: 'ous',
      iveness: 'ive',
      ational: 'ate',
      biliti: 'ble',
      tional: 'tion',
      lessli: 'less',
      ation: 'ate',
      alism: 'al',
      aliti: 'al',
      ousli: 'ous',
      iviti: 'ive',
      fulli: 'ful',
      entli: 'ent',
      enci: 'ence',
      anci: 'ance',
      abli: 'able',
      izer: 'ize',
      ator: 'ate',
      alli: 'al',
      bli: 'ble',
      ogi: 'og',
    };

    let found = false;

    for (const suffix in suffixes) {
      if (passedWord.endsWith(suffix)) {
        found = true;

        if (this.R1.indexOf(suffix) > -1) {

          if (suffix === 'ogi') {

            if (passedWord[passedWord.length - 4] === 'l') {
              // special ogi case
              passedWord = `${passedWord.substring(0, (passedWord.length - suffix.length))}${suffixes[suffix]}`;
            }
          } else {
            passedWord = `${passedWord.substring(0, (passedWord.length - suffix.length))}${suffixes[suffix]}`;
          }
        }
      }
    }

    if (!found && this.R1.indexOf('li') > -1) {
      passedWord = passedWord.replace(new RegExp('#(?<=[cdeghkmnrt])li$#'), '');
    }

    return passedWord;
  }

  step3(word: string) {
    let passedWord = word;
    this.updateR1R2(word);
    const suffixes: stringObj = {
      ational: 'ate',
      tional: 'tion',
      alize: 'al',
      icate: 'ic',
      ative: '',
      iciti: 'ic',
      ical: 'ic',
      ness: '',
      ful: '',
    };

    for (const suffix in suffixes) {
      if (passedWord.endsWith(suffix)) {
        if (this.R1.indexOf(suffix) > -1) {
          if (suffix === 'ative') {
            // special 'ative' case
            passedWord = `${passedWord.substring(0, (passedWord.length - suffix.length))}${suffixes[suffix]}`;

          }
        } else {
          passedWord = `${passedWord.substring(0, (passedWord.length - suffix.length))}${suffixes[suffix]}`;
        }
      }
    }

    return passedWord;
  }

  /**
	 * Step 4
	 *
	 * @param string $word String to stem
	 * @return string
	 */
  step4(word: string) {
    this.updateR1R2(word);
    let passedWord = word;
    const suffixes: stringObj = {
      iveness: '',
      ement: '',
      ance: '',
      ence: '',
      able: '',
      ible: '',
      ant: '',
      ment: '',
      ent: '',
      ism: '',
      ate: '',
      iti: '',
      ous: '',
      ive: '',
      ize: '',
      ion: '',
      al: '',
      er: '',
      ic: '',
    };
    const preceedBy: stringObj = { ion: 's,t' };

    for (const suffix in suffixes) {
      if (passedWord.endsWith(suffix)) {
        if (this.R2.indexOf(suffix) > -1) {
          if (preceedBy.hasOwnProperty(suffix)) {

            const parts = preceedBy[suffix].split(',');
            parts.forEach((part) => {

              if (passedWord.substring((passedWord.length - (suffix.length + 1)), part.length) === part) {
                passedWord = `${passedWord.substring(0, (passedWord.length - suffix.length))}${suffixes[suffix]}`;
              }
            });
          } else {
            passedWord = `${passedWord.substring(0, (passedWord.length - suffix.length))}${suffixes[suffix]}`;
          }
        }
      }
    }

    return passedWord;
  }

  /**
	 * Step 5
	 *
	 * @param string $word String to stem
	 * @return string
	 */
  step5(word: string) {
    let passedWord = word;
    this.updateR1R2(word);

    if (((passedWord.endsWith('e')) && this.R2.indexOf('e') > -1)
      || (passedWord.endsWith('e'))
        && this.R1.indexOf('1') > -1
        && !this.endsWithShortSyllable(passedWord.substring(0, passedWord.length - 1))) {
      passedWord = passedWord.substring(0, passedWord.length - 1);
    } else if (passedWord.endsWith('l') && this.R2.indexOf('l') > -1 && passedWord[passedWord.length - 2] === 'l') {
      passedWord = passedWord.substring(0, passedWord.length - 1);
    }

    return passedWord;
  }
}
