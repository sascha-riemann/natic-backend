import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/service/users.service';
import { SearchUserDto } from '../dto/search-user.dto';

@Injectable()
export class SearchService {
  constructor(private readonly userService: UsersService) {}

  searchUser(searchTerm: string): Promise<SearchUserDto[]> {
    return this.userService.findBySearchTerm(searchTerm);
  }
}
