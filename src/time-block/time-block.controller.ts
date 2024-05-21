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
import { TimeBlockDto } from './dto/time-block.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { TimeBlockService } from './time-block.service';

@Controller('time-block')
export class TimeBlockController {
  constructor(private readonly timeBlockService: TimeBlockService) {}

  @Get()
  @Auth()
  getAll(@CurrentUser('id') userId: string) {
    return this.timeBlockService.getAll(userId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth()
  create(@CurrentUser('id') userId: string, @Body() dto: TimeBlockDto) {
    return this.timeBlockService.create(dto, userId);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string) {
    return this.timeBlockService.remove(id);
  }

  @Put('update/:timeBlockId')
  @Auth()
  update(
    @Body() dto: TimeBlockDto,
    @CurrentUser('id') userId: string,
    @Param('timeBlockId') timeBlockId: string,
  ) {
    return this.timeBlockService.update(dto, timeBlockId, userId);
  }

  @Put('update-order')
  @Auth()
  @HttpCode(200)
  updateOrder(@Body() dto: UpdateOrderDto) {
    return this.timeBlockService.updateOrder(dto.ids);
  }
}
