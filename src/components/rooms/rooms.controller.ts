import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ParseObjectIdPipe } from '../../pipes/parse-object-id.pipe';
import { Types } from 'mongoose';
import { IRoom } from './interfaces/room.interface';
import { IRoomReturned } from './interfaces/room.returned.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.roomsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.roomsService.remove(id);
  }

  /**
   * return users in room without populate (fast),
   * use ...users/inroom/:id from usersController, for that same with populate
   * @param id - room id
   */
  @Get('usersin/:id')
  async getUsersInRoom(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    const room: IRoomReturned = await this.roomsService.findOne(id);
    return room.usersId;
  }

  /**
   * return rooms created by user
   * @param id user id
   */
  @Get('byowner/:id')
  findAllRoomsByOwner(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.roomsService.findAll({ ownerId: id });
  }
}
