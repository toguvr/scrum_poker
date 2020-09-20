import { container } from 'tsyringe';

import './providers';

import UserRepository from '@modules/user/infra/typeorm/repositories/UserRepository';
import IUserRepository from '@modules/user/repositories/IUserRepository';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);
