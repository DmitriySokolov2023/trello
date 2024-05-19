import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTasksDto } from './dto/task-create.dto';
import { TaskDto } from './dto/task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async getAll(userId: string) {
    return this.prisma.task.findMany({
      where: {
        userId,
      },
    });
  }

  async create(userId: string, dto: CreateTasksDto) {
    const data: CreateTasksDto = {
      name: dto.name,
      createdAt: dto.createdAt,
      isCompleted: false,
      priority: dto.priority,
      userId: dto.userId,
    };
    return this.prisma.task.create({
      data,
    });
  }

  async update(dto: Partial<TaskDto>, taskId: string, userId: string) {
    return this.prisma.task.update({
      where: {
        userId,
        id: taskId,
      },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.task.delete({
      where: {
        id,
      },
    });
  }
}
