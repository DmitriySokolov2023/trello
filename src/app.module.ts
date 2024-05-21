import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PomodoroModule } from './pomodoro/pomodoro.module';
import { TaskModule } from './task/task.module';
import { TimeBlockModule } from './time-block/time-block.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot(),
    TaskModule,
    TimeBlockModule,
    PomodoroModule,
  ],
})
export class AppModule {}
