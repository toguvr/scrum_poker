import { Request, Response } from 'express';

import RoomRepository from '@modules/room2/infra/typeorm/repositories/RoomRepository';

import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

export default class RoomController {
  public async create(request: Request, response: Response): Promise<Response> {
    const adm_id = request.user.id;
    const { password, isPrivate } = request.body;

    const listRoom = container.resolve(RoomRepository);

    const room = await listRoom.create({
      password,
      isPrivate,
      adm_id,
    });

    return response.json(classToClass(room));
  }
}
