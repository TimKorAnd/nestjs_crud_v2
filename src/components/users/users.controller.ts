import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ParseObjectIdPipe } from '../../pipes/parse-object-id.pipe';
import { Types } from 'mongoose';
import { IUser } from './interfaces/user.interface';
import { RoomsService } from '../rooms/rooms.service';
import { IRoom } from '../rooms/interfaces/room.interface';
import { IRoomReturned } from '../rooms/interfaces/room.returned.interface';
import { IUserReturned } from './interfaces/user.returned.interface';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserByIdPipe } from '../../pipes/user-by-id.pipe';
import { RoomByIdPipe } from '../../pipes/room-by-id.pipe';
import { isEmptyOrNull } from '../../helpers/is-empty-obj.helper';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly roomsService: RoomsService,
  ) {}

  @ApiBody({ type: CreateUserDto })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.usersService.findOne(id);
  }

  @ApiBody({ type: UpdateUserDto })
  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() update: UpdateUserDto,
  ) {
    return this.usersService.update(id, update);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.usersService.remove(id);
  }

  /**
   * return users in room with populate
   * @param id - room id
   */
  @Get('inroom/:id')
  findAllUsersInRoom(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.usersService.findAll({ roomId: id });
  }

  @Post('join-to-room')
  async joinToRoom(
    @Body('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @Body('roomId', ParseObjectIdPipe) roomId: Types.ObjectId,
  ) {
    const joinRoomId: Types.ObjectId = roomId;
    /* write new roomId in user*/
    const user: IUser = await this.usersService.update(
      userId,
      { roomId: joinRoomId },
      { new: false },
    );
    const leftRoom: IRoomReturned = user.roomId as IRoomReturned; // TODO is normal approach?
    const leftRoomId: Types.ObjectId = leftRoom?._id;
    // TODO check for user exists (validation Mongo?)
    // TODO if (leftRoomId.toString() === joinRoomId.toString() {...})
    if (leftRoomId) {
      const leftRoom1 = await this.roomsService.leaveUserFromRoom(
        userId,
        leftRoomId,
      );
    }
    const joinRoom = await this.roomsService.addUserToRoom(userId, joinRoomId);
  }

  @Post('leave-from-room')
  async leaveFromRoom(
    @Body('userId', ParseObjectIdPipe, UserByIdPipe) user: IUser,
    @Body('roomId', ParseObjectIdPipe, RoomByIdPipe) room: IRoomReturned,
  ) {
    const leftRoom: IRoomReturned = user.roomId as IRoomReturned; // TODO is normal approach?
    if (isEmptyOrNull(leftRoom)) {
      return 'no roomId in user';
    }
    user.roomId = null;
    await user.save();
    room = await this.roomsService.leaveUserFromRoom(user._id, leftRoom._id);
    return {
      user,
      room,
    };
  }
}
