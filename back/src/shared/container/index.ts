import { container } from 'tsyringe';

import './providers';

import IRoomRepository from '@modules/room/repositories/IRoomRepository';
import RoomRepository from '@modules/room/infra/typeorm/repositories/RoomRepository';

container.registerSingleton<IRoomRepository>('RoomRepository', RoomRepository);
