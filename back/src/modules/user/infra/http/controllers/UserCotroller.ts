import { Request, Response } from 'express';

import { container } from 'tsyringe';
import CreateUserService from '@modules/user/services/CreateUserService';
import { classToClass } from 'class-transformer';

export default class UserCotroller {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name } = request.body;

    const createUser = container.resolve(CreateUserService);

    const { user, token } = await createUser.execute({
      name,
    });

    return response.json({ user: classToClass(user), token });
  }
}
