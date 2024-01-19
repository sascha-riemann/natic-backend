import { UserDto } from '../../users/dto/user.dto';

export interface CreateProjectTask {
  title: string;
  description: string;
  deadline: Date;
  assignedUser: number[];
  project: number;
}

export interface UpdateProjectTask extends CreateProjectTask {
  id: number;
}

export interface ProjectTask
  extends Omit<UpdateProjectTask, 'assignedUser' | 'project'> {
  assignedUser: UserDto[];
}
