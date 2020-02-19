import { Entity } from '../../lib/Entity';
import { Dictionary } from '../../inc/Dictionary';
import { Meaning } from './Meaning';

export class Revision extends Entity {
  private entry;
  private change;
  private nounClasses;
  private meanings: Meaning[] | null = null;
  private tags = {};
  private examples;

  /**
	 * Constructs a revision
	 * @param int id the revision id
	 * @param int entryId the entry id
	 * @param int number the revision number
	 * @param int status the revision status (archived, accepted etc)
	 * @param int changeId the change id
	 * @param string wordClass the word class, e,g, 'n'
	 * @param string prefix the prefix, e.g 'umu'
	 * @param string lemma the lemma, e.g. 'gabo'
	 * @param string modifier the modifier, e.g. 'aba-'
	 * @param string pronunciation the pronunciation, e.g. 'umugabo'
	 * @param string comment the comment
	 * @param bool unverified TRUE if revision is unverified
	 */
  constructor(
    protected id: number,
    private entryId: number = 0,
    private number: number = 0,
    private status: number = 0,
    private changeId: number = 0,
    private wordClass: string = '',
    private prefix: string = '',
    private lemma: string = '',
    private modifier: string = '',
    private pronunciation: string = '',
    private comment: string = '',
    private unverified: boolean = false,
    ) {
    super(id);
  }

  /**
	 * Gets meanings using lazy loading
	 * @return array the meanings
	 */
  async getMeanings() {
    if (!this.meanings) {
      this.meanings = await Dictionary.getEntryService().getRevisionMeanings(this);
    }
    return this.meanings;
  }

  /**
	 * Gets the word class
	 * @return string the word class
	 */
  getWordClass() {
    return this.wordClass;
  }

  /**
	 * Sets the word class
	 * @param string wordClass the word class
	 */
  setWordClass(wordClass: string) {
    this.wordClass = wordClass;
  }

  /**
	 * Gets the modifier
	 * @return string the modifier
	 */
  getModifier() {
    return this.modifier;
  }

  /**
   * Sets the modifier
   * @param string modifier the modifier
   */
  setModifier(modifier: string) {
    this.modifier = modifier;
  }

  /**
	 * Gets the prefix
	 * @return string the prefix
	 */
  getPrefix() {
    return this.prefix;
  }

  /**
	 * Gets the lemma
	 * @return string the lemma
	 */
  getLemma() {
    return this.lemma;
  }
}
