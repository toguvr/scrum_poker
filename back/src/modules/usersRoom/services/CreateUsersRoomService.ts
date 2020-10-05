import {
  isBefore,
  getDate,
  getMonth,
  getYear,
  addHours,
  isAfter,
} from 'date-fns';

import AppError from '@shared/errors/AppError';

import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/user/repositories/IUserRepository';
import IRoomRepository from '@modules/room/repositories/IRoomRepository';
import IUsersRoomRepository from '@modules/usersRoom/repositories/IUsersRoomRepository';
import UsersRoom from '../infra/typeorm/entities/UsersRoom';
import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';

interface IRequest {
  room_id: string;
  vote?: number;
  user_id: string;
  password?: string;
}

@injectable()
class CreateUsersRoomService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('RoomRepository')
    private roomRepository: IRoomRepository,

    @inject('UsersRoomRepository')
    private usersRoomRepository: IUsersRoomRepository,
  ) {}

  public async show({ room_id, user_id }: IRequest): Promise<UsersRoom[]> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('Dados do usuário não existe.');
    }

    const room = await this.roomRepository.findById(room_id);

    if (!room) {
      throw new AppError('Sala não existe.');
    }

    return await this.usersRoomRepository.findAllInRoom(room_id);
  }
  public async change({
    room_id,
    user_id,
    vote,
  }: IRequest): Promise<UsersRoom> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('Dados do usuário não existe.');
    }

    const room = await this.roomRepository.findById(room_id);

    if (!room) {
      throw new AppError('Sala não existe.');
    }

    const isAdmRoom = await this.roomRepository.findByAdmId(user_id);

    if (isAdmRoom && room_id === isAdmRoom.id) {
      throw new AppError('Admin não vota.');
    }

    const userVote = await this.usersRoomRepository.findByUserIdandRoomId({
      user_id,
      room_id,
    });

    if (!userVote) {
      throw new AppError('Usuário não esta na sala para votar.');
    }

    userVote.vote = vote;

    return await this.usersRoomRepository.save(userVote);
  }

  public async see({ room_id, user_id, password }: IRequest): Promise<boolean> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('Dados do usuário não existe.');
    }

    const room = await this.roomRepository.findById(room_id);

    if (!room) {
      throw new AppError('Sala não existe.');
    }

    const userInRoomThisRoom = await this.usersRoomRepository.findByUserIdandRoomId(
      {
        room_id,
        user_id,
      },
    );

    const isAdmRoom = await this.roomRepository.findByAdmId(user_id);

    if (userInRoomThisRoom) {
      throw new AppError('Você já está na sala.');
    }

    if (room.isPrivate) {
      if (!password) {
        throw new AppError('Sala privada, informe a senha.');
      }

      const passwordMatched = await this.hashProvider.compareHash(
        password as string,
        room?.password as string,
      );

      if (room.isPrivate && !passwordMatched) {
        throw new AppError('Senha incorreta.');
      }
    }

    const userInAnyRoom = await this.usersRoomRepository.findUserInAnyRoom(
      user_id,
    );

    if (userInAnyRoom) {
      await this.usersRoomRepository.remove(userInAnyRoom);
    }

    if (isAdmRoom && room_id !== isAdmRoom.id) {
      await this.roomRepository.delete(isAdmRoom);
    }

    return true;
  }

  public async execute({
    room_id,
    user_id,
    password,
  }: IRequest): Promise<UsersRoom> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('Dados do usuário não existe.');
    }

    const room = await this.roomRepository.findById(room_id);

    if (!room) {
      throw new AppError('Sala não existe.');
    }

    const userInRoomThisRoom = await this.usersRoomRepository.findByUserIdandRoomId(
      {
        room_id,
        user_id,
      },
    );

    const isAdmRoom = await this.roomRepository.findByAdmId(user_id);

    if (userInRoomThisRoom) {
      throw new AppError('Você já está na sala.');
    }

    if (room.isPrivate) {
      if (!password) {
        throw new AppError('Sala privada, informe a senha.');
      }

      const passwordMatched = await this.hashProvider.compareHash(
        password as string,
        room?.password as string,
      );

      if (room.isPrivate && !passwordMatched) {
        throw new AppError('Senha incorreta.');
      }
    }

    const userInAnyRoom = await this.usersRoomRepository.findUserInAnyRoom(
      user_id,
    );

    if (userInAnyRoom) {
      await this.usersRoomRepository.remove(userInAnyRoom);
    }

    if (isAdmRoom && room_id === isAdmRoom.id) {
      throw new AppError('Você é o admin, não pode entrar para votar.');
    }

    if (isAdmRoom && room_id !== isAdmRoom.id) {
      await this.roomRepository.delete(isAdmRoom);
    }

    return await this.usersRoomRepository.create({
      user_id,
      room_id,
    });
  }
}

export default CreateUsersRoomService;
