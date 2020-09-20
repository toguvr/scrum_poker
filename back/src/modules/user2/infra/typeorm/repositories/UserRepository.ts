import { MongoRepository, getMongoRepository } from 'typeorm';
import authConfig from '@config/auth';

import IUserRepository from '@modules/user2/repositories/IUserRepository';
import ICreateUserDTO from '@modules/user2/dtos/ICreateUserDTO';

import { sign } from 'jsonwebtoken';
import { json } from 'express';
import User from '../schemas/User';

interface IResponse {
  user: User;
  token: string;
}

class UserRepository implements IUserRepository {
  private ormRepository: MongoRepository<User>;

  constructor() {
    this.ormRepository = getMongoRepository(User, 'mongo');
  }

  public async create({ name }: ICreateUserDTO): Promise<IResponse> {
    const user = this.ormRepository.create({
      name,
    });

    await this.ormRepository.save(user);

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: JSON.stringify(user.id),
      expiresIn,
    });

    return { user, token };
  }
}

export default UserRepository;
