import ICreateUserDTO from '../dtos/ICreateUserDTO';

import User from '../infra/typeorm/schemas/User';
interface IResponse {
  user: User;
  token: string;
}
export default interface IUserRepository {
  create(data: ICreateUserDTO): Promise<IResponse>;
}
