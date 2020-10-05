import {
  Repository,
  getRepository,
  Raw,
  Between,
  MoreThanOrEqual,
  LessThan,
} from 'typeorm';

import IRoomRepository from '@modules/room/repositories/IRoomRepository';
import ICreateRoomDTO from '@modules/room/dtos/ICreateRoomDTO';

import Room from '../entities/Room';

class RoomRepository implements IRoomRepository {
  private ormRepository: Repository<Room>;

  constructor() {
    this.ormRepository = getRepository(Room);
  }

  public async findAll(): Promise<Room[]> {
    const findAppointment = await this.ormRepository.find({
      relations: ['admin', 'usersRoom'],
    });

    return findAppointment;
  }

  public async findById(id: string): Promise<Room | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { id },
    });

    return findAppointment;
  }

  public async findByAdmId(id: string): Promise<Room | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { adm_id: id },
    });

    return findAppointment;
  }

  public async delete(data: Room): Promise<void> {
    await this.ormRepository.remove(data);
  }

  public async saveRoom(data: Room): Promise<void> {
    await this.ormRepository.save(data);
  }

  public async create({
    adm_id,
    isPrivate,
    password,
  }: ICreateRoomDTO): Promise<Room> {
    const room = this.ormRepository.create({
      adm_id,
      isPrivate,
      password,
    });

    await this.ormRepository.save(room);

    return room;
  }
}

export default RoomRepository;
