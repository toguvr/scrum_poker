import { Repository, getRepository } from 'typeorm';

import IUsersRoomRepository from '@modules/usersRoom/repositories/IUsersRoomRepository';
import ICreateUsersRoomDTO from '@modules/usersRoom/dtos/ICreateUsersRoomDTO';

import UsersRoom from '../entities/UsersRoom';

class UsersRoomRepository implements IUsersRoomRepository {
  private ormRepository: Repository<UsersRoom>;

  constructor() {
    this.ormRepository = getRepository(UsersRoom);
  }

  public async findById(id: string): Promise<UsersRoom | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { id },
    });

    return findAppointment;
  }

  public async findByUserIdandRoomId({
    user_id,
    room_id,
  }: ICreateUsersRoomDTO): Promise<UsersRoom | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { user_id, room_id },
    });

    return findAppointment;
  }

  public async findUserInAnyRoom(
    user_id: string,
  ): Promise<UsersRoom | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { user_id },
    });

    return findAppointment;
  }

  public async findAllInRoom(room_id: string): Promise<UsersRoom[]> {
    const findAppointment = await this.ormRepository.find({
      where: { room_id },
      relations: ['user', 'room'],
    });

    return findAppointment;
  }

  public async remove(data: UsersRoom): Promise<void> {
    await this.ormRepository.remove(data);
  }

  public async save(data: UsersRoom): Promise<UsersRoom> {
    return await this.ormRepository.save(data);
  }

  public async create({
    user_id,
    room_id,
  }: ICreateUsersRoomDTO): Promise<UsersRoom> {
    const usersRoom = this.ormRepository.create({
      user_id,
      room_id,
    });

    await this.ormRepository.save(usersRoom);

    return usersRoom;
  }
}

export default UsersRoomRepository;
