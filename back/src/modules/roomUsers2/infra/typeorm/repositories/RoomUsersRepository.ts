import { MongoRepository, getMongoRepository } from 'typeorm';

import IRoomUsersRepository from '@modules/roomUsers2/repositories/IRoomUsersRepository';
import IroomUsersDTO from '@modules/roomUsers2/dtos/IroomUsersDTO';

import Notification from '../schemas/RoomUsers';

class NotificationsRepository implements IRoomUsersRepository {
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }

  public async create({
    content,
    recipient_id,
  }: IroomUsersDTO): Promise<Notification> {
    const notification = this.ormRepository.create({
      content,
      recipient_id,
    });

    await this.ormRepository.save(notification);

    return notification;
  }
}

export default NotificationsRepository;
