import { Controller, Get, Param } from '@nestjs/common';
import { SearchUserDto } from '../dto/search-user.dto';
import { SearchService } from '../service/search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}
  @Get('user/:searchTerm')
  searchUser(
    @Param('searchTerm') searchTerm: string,
  ): Promise<SearchUserDto[]> {
    return this.searchService.searchUser(searchTerm);
  }
}
