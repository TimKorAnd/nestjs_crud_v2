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
/*import { UserByIdPipe } from '../../pipes/user-by-id.pipe';
import { UserEntity } from './entities/user.entity';*/

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    // private readonly roomsService: RoomsService,
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

  /*@Post('jointoroom')
  async joinToRoom(
    @Body('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @Body('RoomId', ParseObjectIdPipe) roomId: Types.ObjectId,
  ) {
    try {
      const joinRoomId = roomId;
      const leftRoomId = (
        await this.usersService.update(
          userId,
          { roomId: joinRoomId },
          { new: false },
        )
      )?.roomId;
      // TODO check for user exists (validation Mongo?)
      // TODO if (leftRoomId.toString() === joinRoomId.toString() {...})
      const leftRoom = await this.roomsService.leaveUserFromRoom(
        userId,
        leftRoomId,
      );
      const joinRoom = await this.roomsService.addUserToRoom(
        userId,
        joinRoomId,
      );

      /*res.status(200).json({
        message:
          {
            status: 'successful',
            userId,
            leftRoomId: leftRoom?._id ?? 'not left the room, because user did`t have a room',
            joinRoomId: joinRoom?._id ?? 'not join the room, because room not exists',
          },
      });*/
  /* } catch (err) {
      // this.errorHandler(err, res);
    }
  } */
}
