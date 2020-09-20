import { ObjectID } from 'mongodb';

import IRoomUsersRepository from '@modules/roomUsers2/repositories/IRoomUsersRepository';
import IroomUsersDTO from '@modules/roomUsers2/dtos/IroomUsersDTO';

import Notification from '../../infra/typeorm/schemas/RoomUsers';

class NotificationsRepository implements IRoomUsersRepository {
  private notifications: Notification[] = [];

  public async create({
    content,
    recipient_id,
  }: IroomUsersDTO): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, { id: new ObjectID(), content, recipient_id });

    await this.notifications.push(notification);

    return notification;
  }
}

export default NotificationsRepository;
