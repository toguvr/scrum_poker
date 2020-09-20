import { ObjectID } from 'mongodb';

import IRoomRepository from '@modules/room2/repositories/IRoomRepository';
import ICreateRoomDTO from '@modules/room2/dtos/ICreateRoomDTO';

import Notification from '../../infra/typeorm/schemas/User';

class FakeUsersRepository implements IRoomRepository {
  private notifications: Notification[] = [];

  public async create({
    content,
    recipient_id,
  }: ICreateRoomDTO): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, { id: new ObjectID(), content, recipient_id });

    await this.notifications.push(notification);

    return notification;
  }
}

export default FakeUsersRepository;
