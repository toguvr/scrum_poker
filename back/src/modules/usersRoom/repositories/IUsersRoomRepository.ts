import UsersRoom from '../infra/typeorm/entities/UsersRoom';
import ICreateUsersRoomDTO from '../dtos/ICreateUsersRoomDTO';

export default interface UsersRoomRepository {
  create(data: ICreateUsersRoomDTO): Promise<UsersRoom>;
  findById(id: string): Promise<UsersRoom | undefined>;
  findUserInAnyRoom(user_id: string): Promise<UsersRoom | undefined>;
  findAllInRoom(round_id: string): Promise<UsersRoom[]>;
  save(data: UsersRoom): Promise<UsersRoom>;
  findByUserIdandRoomId(
    data: ICreateUsersRoomDTO,
  ): Promise<UsersRoom | undefined>;
  remove(data: UsersRoom): Promise<UsersRoom | undefined>;
}
