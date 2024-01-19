import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from './authentication/authentication.module';
import { UsersModule } from './users/users.module';
import { ProjectModule } from './project/project.module';
import { BusinessModule } from './business/business.module';
import { PlanningModule } from './planning/planning.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ResourcesModule } from './resources/resources.module';
import { TimesheetModule } from './timesheet/timesheet.module';
import { RoleModule } from './role/role.module';
import { ProjectTaskModule } from './project-task/project-task.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: 5432,
      host: 'localhost',
      database: 'natic',
      username: 'natic',
      password: 'natic',
      // host: '/cloudsql/natic-391722:europe-west3:natic',
      // database: 'postgres',
      // username: 'postgres',
      // password: 'l1&CL-";_E%S6,8d',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'front'),
      exclude: ['/api/(.*)'],
    }),
    AuthenticationModule,
    BusinessModule,
    UsersModule,
    ProjectModule,
    PlanningModule,
    ResourcesModule,
    TimesheetModule,
    RoleModule,
    ProjectTaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
