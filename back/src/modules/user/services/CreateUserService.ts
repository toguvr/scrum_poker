import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

import { inject, injectable } from 'tsyringe';

import IUserRepository from '@modules/user2/repositories/IUserRepository';
import { sign } from 'jsonwebtoken';
import Users from '../infra/typeorm/entities/User';

interface IRequest {
  name: string;
}

interface IResponse {
  user: Users;
  token: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({ name }: IRequest): Promise<IResponse> {
    const user = await this.userRepository.create({
      name,
    });

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return { user, token };
  }
}

export default CreateUserService;
