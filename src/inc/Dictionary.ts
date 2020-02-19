import { TagService } from './tag/TagService';
import { Database } from './Database';
import { SearchService } from './search/SearchService';
import { LanguageService } from './language/LanguageService';
import { EntryService } from './entry/EntryService';

export class Dictionary {
  // private static userService;
  private static entryService: EntryService;
  private static tagService: TagService;
  // private static pageService;
  private static languageService: LanguageService;
  // private static changeService;
  private static searchService: SearchService;
  // private static reportService;

  static getTagService(): TagService {
    if (!this.tagService) {
      this.tagService = new TagService(Database.getInstance());
    }

    return this.tagService;
  }

  static getSearchService() {
    if (!this.searchService) {
      this.searchService = new SearchService(Database.getInstance());
    }

    return this.searchService;
  }

  static getLanguageService() {
    if (!this.languageService) {
      this.languageService = new LanguageService(Database.getInstance());
    }

    return this.languageService;
  }

  /**
	 * Gets the entry service
	 * @return EntryService the singleton instance of the service
	 */
  static getEntryService() {
    if (!this.entryService) {
      this.entryService = new EntryService(Database.getInstance());
    }

    return this.entryService;
  }
}
