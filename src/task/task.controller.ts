import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { CreateTasksDto } from './dto/task-create.dto';
import { TaskDto } from './dto/task.dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @Auth()
  getAll(@CurrentUser('id') userId: string) {
    return this.taskService.getAll(userId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth()
  create(@CurrentUser('id') userId: string, @Body() dto: CreateTasksDto) {
    return this.taskService.create(userId, dto);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string) {
    return this.taskService.remove(id);
  }

  @Put(':id')
  @Auth()
  update(
    @Body() dto: TaskDto,
    @CurrentUser('id') userId: string,
    @Param('id') taskId: string,
  ) {
    return this.taskService.update(dto, taskId, userId);
  }
}
