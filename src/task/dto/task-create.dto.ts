import { TaskDto } from './task.dto';

export class CreateTasksDto extends TaskDto {
  userId: string;
}
