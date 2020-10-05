import { Request, Response } from 'express';

import { container } from 'tsyringe';
import CreateRoomService from '@modules/room/services/CreateRoomService';
import { classToClass } from 'class-transformer';

export default class RoomController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const createRoom = container.resolve(CreateRoomService);

    const room = await createRoom.show();

    return response.json(classToClass(room));
  }
  public async leave(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const createRoom = container.resolve(CreateRoomService);

    const { room_id, boolean } = await createRoom.leave(user_id);

    const { io } = request;
    const { connectedUsers } = request;

    if ((boolean === 'admin' || boolean === true) && connectedUsers) {
      io.to(`room${room_id}`).emit('leftRoom', {
        boolean,
        sala: `room${room_id}`,
      });

      io.to('home room').emit('leftHome', { boolean, sala: `home room` });
    }

    return response.json(classToClass(boolean));
  }
  public async teste(request: Request, response: Response): Promise<Response> {
    return response.json(process.env.MYSQLCONNSTR_localdb);
  }
  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { topic } = request.body;

    const createRoom = container.resolve(CreateRoomService);

    const room = await createRoom.change({
      user_id,
      topic,
    });

    const { io } = request;
    const { connectedUsers } = request;

    if (connectedUsers) {
      io.to(`room${room.id}`).emit(`newTopic${room.id}`, room);
    }

    return response.json(classToClass(room));
  }
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { isPrivate, password } = request.body;

    const createRoom = container.resolve(CreateRoomService);

    const room = await createRoom.execute({
      user_id,
      isPrivate,
      password,
    });

    const { io } = request;
    const { connectedUsers } = request;

    if (connectedUsers) {
      io.to(`room${room.id}`).emit('createRoom', room);
      io.to('home room').emit('createRoomatHome', room);
    }

    return response.json(classToClass(room));
  }
}
