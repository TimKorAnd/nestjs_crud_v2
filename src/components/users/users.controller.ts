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
import { Room } from '../rooms/schema/room.schema';
/*import { UserByIdPipe } from '../../pipes/user-by-id.pipe';
import { UserEntity } from './entities/user.entity';*/

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly roomsService: RoomsService,
  ) {}

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

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() update: IUser,
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
    const leftRoom: IRoom = user.roomId as IRoom; // TODO is normal approach?
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

    /*res.status(200).json({
        message:
          {
            status: 'successful',
            userId,
            leftRoomId: leftRoom?._id ?? 'not left the room, because user did`t have a room',
            joinRoomId: joinRoom?._id ?? 'not join the room, because room not exists',
          },
      }); */
  }

  @Post('leave-from-room')
  async leaveFromRoom(
    @Body('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @Body('roomId', ParseObjectIdPipe) roomId: Types.ObjectId,
  ) {
    const user: IUser = await this.usersService.update(
      userId,
      { roomId: null },
      { new: false },
    );
    const leftRoom: IRoom = user.roomId as IRoom; // TODO is normal approach?
    const leftRoomId: Types.ObjectId = leftRoom?._id;
    if (!leftRoomId) {
      return 'no roomId in user';
    }
    const leftRoom1 = await this.roomsService.leaveUserFromRoom(
      userId,
      leftRoomId,
    );
    return leftRoom;
  }
}
