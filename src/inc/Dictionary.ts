import { TagService } from './tag/TagService';
import { Database } from './Database';

export class Dictionary {
  private static userService;
  private static entryService;
  private static tagService: TagService;
  private static pageService;
  private static languageService;
  private static changeService;
  private static searchService;
  private static reportService;

  static getTagService () {
    if (!this.tagService) {
      this.tagService = new TagService(Database.getInstance());
    }

    return this.tagService;
  }
}
