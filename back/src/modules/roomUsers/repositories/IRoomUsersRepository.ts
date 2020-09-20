import IroomUsersDTO from '../dtos/IroomUsersDTO';

import RoomUsers from '../infra/typeorm/schemas/RoomUsers';

export default interface IRoomUsersRepository {
  create(data: IroomUsersDTO): Promise<RoomUsers>;
}
