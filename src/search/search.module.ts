import { Module } from '@nestjs/common';
import { SearchController } from './controller/search.controller';
import { SearchService } from './service/search.service';
import { UsersService } from '../users/service/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entity/user.entity';

@Module({
  controllers: [SearchController],
  providers: [SearchService, UsersService],
  imports: [TypeOrmModule.forFeature([User])],
})
export class SearchModule {}
