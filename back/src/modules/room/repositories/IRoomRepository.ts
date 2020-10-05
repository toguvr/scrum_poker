import Room from '../infra/typeorm/entities/Room';
import ICreateAppointmentDTO from '../dtos/ICreateRoomDTO';

export default interface IRoomRepository {
  create(data: ICreateAppointmentDTO): Promise<Room>;
  findAll(): Promise<Room[]>;
  findById(id: string): Promise<Room | undefined>;
  findByAdmId(id: string): Promise<Room | undefined>;
  delete(data: Room): Promise<Room | undefined>;
  saveRoom(data: Room): Promise<void>;
}
