import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../authentication/guard/JwtAuthGuard';
import {
  AuthenticatedUser,
  AuthUser,
} from '../../authentication/decorators/user-decorator';
import { TimesheetService } from '../service/timesheet.service';
import { TimesheetEntryFormDto, Timesheet } from '../dto/timesheet-entry.dto';
import { BusinessId } from '../../business/decorator/business.decorator';

@Controller('timesheet')
export class TimesheetController {
  constructor(private readonly timesheetService: TimesheetService) {}

  @Get(':start/:end')
  @UseGuards(JwtAuthGuard)
  getTimesheet(
    @AuthUser() user: AuthenticatedUser,
    @Param('start') start: Date,
    @Param('end') end: Date,
    @BusinessId() businessId: number,
  ): Promise<Timesheet> {
    return this.timesheetService.getTimesheetEntries(
      new Date(start),
      new Date(end),
      user.id,
      businessId,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  postTimesheetEntry(
    @AuthUser() user: AuthenticatedUser,
    @Body() timesheetEntryCreateDto: TimesheetEntryFormDto,
  ): Promise<void> {
    return this.timesheetService.postTimesheetEntry(
      timesheetEntryCreateDto,
      timesheetEntryCreateDto.userId || user.id,
    );
  }

  @Delete('entry/:id')
  @UseGuards(JwtAuthGuard)
  deleteTimesheetEntry(
    @AuthUser() user: AuthenticatedUser,
    @Param('id') id: number,
  ) {
    this.timesheetService.deleteTimesheetEntry(id, user.id);
  }
}
