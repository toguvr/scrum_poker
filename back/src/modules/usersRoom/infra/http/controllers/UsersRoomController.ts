import { Request, Response } from 'express';

import { container } from 'tsyringe';
import CreateUsersRoomService from '@modules/usersRoom/services/CreateUsersRoomService';
import { classToClass } from 'class-transformer';

export default class AppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { room_id } = request.params;

    const createAppointment = container.resolve(CreateUsersRoomService);

    const usersRoom = await createAppointment.show({
      room_id,
      user_id,
    });

    return response.json(classToClass(usersRoom));
  }
  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { room_id, vote } = request.body;

    const createAppointment = container.resolve(CreateUsersRoomService);

    const usersRoom = await createAppointment.change({
      room_id,
      user_id,
      vote,
    });

    const { io } = request;
    const { connectedUsers } = request;

    if (connectedUsers) {
      io.to(`room${room_id}`).emit(`newVote${room_id}`, usersRoom);
    }

    return response.json(classToClass(usersRoom));
  }
  public async see(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { room_id, password } = request.body;

    const createAppointment = container.resolve(CreateUsersRoomService);

    const usersRoom = await createAppointment.see({
      room_id,
      user_id,
      password,
    });

    return response.json(classToClass(usersRoom));
  }
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { room_id, password } = request.body;

    const createAppointment = container.resolve(CreateUsersRoomService);

    const usersRoom = await createAppointment.execute({
      room_id,
      user_id,
      password,
    });

    const { io } = request;
    const { connectedUsers } = request;

    if (connectedUsers) {
      io.to(`room${room_id}`).emit('joinRoom', usersRoom);
      io.to('home room').emit('joinRoomAtHome', usersRoom);
    }

    return response.json(classToClass(usersRoom));
  }
}
