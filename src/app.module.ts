import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from './authentication/authentication.module';
import { UsersModule } from './users/users.module';
import { ProjectModule } from './project/project.module';
import { BusinessModule } from './business/business.module';
import { RoleModule } from './role/role.module';
import { SearchModule } from './search/search.module';
import { PlanningModule } from './planning/planning.module';

@Module({
  imports: [
    AuthenticationModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'natic',
      password: 'natic',
      database: 'natic',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProjectModule,
    BusinessModule,
    RoleModule,
    SearchModule,
    PlanningModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
