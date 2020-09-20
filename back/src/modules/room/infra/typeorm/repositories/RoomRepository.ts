import { MongoRepository, getMongoRepository } from 'typeorm';

import IRoomRepository from '@modules/room/repositories/IRoomRepository';
import ICreateRoomDTO from '@modules/room/dtos/ICreateRoomDTO';

import Room from '../schemas/Room';

class RoomRepository implements IRoomRepository {
  private ormRepository: MongoRepository<Room>;

  constructor() {
    this.ormRepository = getMongoRepository(Room, 'mongo');
  }

  public async create({
    password,
    isPrivate,
    adm_id,
  }: ICreateRoomDTO): Promise<Room> {
    const room = this.ormRepository.create({
      password,
      isPrivate,
      adm_id: adm,
    });

    await this.ormRepository.save(room);

    return room;
  }
}

export default RoomRepository;
