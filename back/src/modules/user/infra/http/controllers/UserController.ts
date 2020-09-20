import { Request, Response } from 'express';

import UserRepository from '@modules/user/infra/typeorm/repositories/UserRepository';

import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

export default class UserController {
  public async create(request: Request, response: Response): Promise<Response> {
    // const provider_id = request.user.id;
    const { name } = request.body;

    const listUser = container.resolve(UserRepository);

    const { user, token } = await listUser.create({
      name,
    });
    return response.json({ user: classToClass(user), token });
  }
}
