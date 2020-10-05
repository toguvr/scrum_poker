import { container } from 'tsyringe';

import './providers';

import UserRepository from '@modules/user/infra/typeorm/repositories/UserRepository';
import IUserRepository from '@modules/user/repositories/IUserRepository';

import RoomRepository from '@modules/room/infra/typeorm/repositories/RoomRepository';
import IRoomRepository from '@modules/room/repositories/IRoomRepository';

import UsersRoomRepository from '@modules/usersRoom/infra/typeorm/repositories/UsersRoomRepository';
import IUsersRoomRepository from '@modules/usersRoom/repositories/IUsersRoomRepository';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);

container.registerSingleton<IRoomRepository>('RoomRepository', RoomRepository);

container.registerSingleton<IUsersRoomRepository>(
  'UsersRoomRepository',
  UsersRoomRepository,
);
