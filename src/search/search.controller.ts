import { Controller, Get, Inject, Param } from '@nestjs/common';

import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(
    @Inject(SearchService) private readonly searchService: SearchService,
  ) {}

  @Get(':keyword')
  search(@Param('keyword') keyword: string) {
    return this.searchService.search(keyword);
  }
}
