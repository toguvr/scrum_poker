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
import IUsersRoomRepository from '@modules/usersRoom/repositories/IUsersRoomRepository';

import Room from '../infra/typeorm/entities/Room';
import IRoomRepository from '../repositories/IRoomRepository';
import UsersRoom from '@modules/usersRoom/infra/typeorm/entities/UsersRoom';
import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';

interface IRequest {
  user_id: string;
  isPrivate: boolean;
  password: string;
}

interface IRequestChange {
  user_id: string;
  topic: string;
}

interface IRequestLeave {
  boolean: boolean | string;
  room_id?: string;
}

@injectable()
class CreateRoomService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUsersRepository,

    @inject('RoomRepository')
    private roomRepository: IRoomRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('UsersRoomRepository')
    private usersRoomRepository: IUsersRoomRepository,
  ) {}

  public async show(): Promise<Room[]> {
    return await this.roomRepository.findAll();
  }

  public async leave(user_id: string): Promise<IRequestLeave> {
    const roomIAmAdmId = await this.roomRepository.findByAdmId(user_id);

    const userInAnyRoom = await this.usersRoomRepository.findUserInAnyRoom(
      user_id,
    );

    const roomIAmAdmId_id = roomIAmAdmId?.id;
    const userInAnyRoom_id = userInAnyRoom?.room_id;
    if (roomIAmAdmId) {
      await this.roomRepository.delete(roomIAmAdmId);

      return { boolean: 'admin', room_id: roomIAmAdmId_id };
    }

    if (userInAnyRoom) {
      await this.usersRoomRepository.remove(userInAnyRoom);
    }

    if (!roomIAmAdmId && !userInAnyRoom) {
      return { boolean: false };
    }

    return { boolean: true, room_id: userInAnyRoom_id };
  }

  public async change({ user_id, topic }: IRequestChange): Promise<Room> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('Dados do usuário não existe.');
    }

    const isAdm = await this.roomRepository.findByAdmId(user_id);

    if (!isAdm) {
      throw new AppError('Apenas adm cria topicos.');
    }

    const room = await this.roomRepository.findById(isAdm.id);

    if (!room) {
      throw new AppError('Sala não existe.');
    }

    room.topic = topic;

    await this.roomRepository.saveRoom(room);

    const allRooms = await this.usersRoomRepository.findAllInRoom(room.id);

    const rooms = allRooms.map(async currentRoom => {
      currentRoom.vote = null;
      await this.usersRoomRepository.save(currentRoom);
    });

    await Promise.all(rooms);

    return room;
  }

  public async execute({
    user_id,
    isPrivate,
    password,
  }: IRequest): Promise<Room> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('Dados do usuário não existe.');
    }

    const isAdm = await this.roomRepository.findByAdmId(user_id);

    if (isAdm) {
      await this.roomRepository.delete(isAdm);
    }

    const userInAnyRoom = await this.usersRoomRepository.findUserInAnyRoom(
      user_id,
    );

    if (userInAnyRoom) {
      await this.usersRoomRepository.remove(userInAnyRoom);
    }

    let room;

    if (isPrivate) {
      const hashedPassword = await this.hashProvider.generateHash(password);

      return (room = await this.roomRepository.create({
        adm_id: user_id,
        isPrivate,
        password: hashedPassword,
      }));
    }

    return (room = await this.roomRepository.create({
      adm_id: user_id,
      isPrivate,
    }));
  }
}

export default CreateRoomService;
