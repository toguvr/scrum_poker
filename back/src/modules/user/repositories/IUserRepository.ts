import User from '../infra/typeorm/entities/User';
import ICreateAppointmentDTO from '../dtos/ICreateUserDTO';
import IFindAllInMonthFromProviderDTO from '../dtos/IFindAllInMonthFromProviderDTO';
import IFindAllUserAppoinrmentFromEnterpriseDTO from '../dtos/IFindAllUserAppoinrmentFromEnterpriseDTO';

export default interface IUserRepository {
  create(data: ICreateAppointmentDTO): Promise<User>;
  findByDate(date: Date, provider_id: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
  remove(data: ICreateAppointmentDTO): Promise<User | undefined>;
  findAllInMonthFromProvider(
    data: IFindAllInMonthFromProviderDTO,
  ): Promise<User[]>;
  searchAllAppointmentsFromUserBetweenDate(
    data: IFindAllUserAppoinrmentFromEnterpriseDTO,
  ): Promise<User[]>;
  findAllFromUser(user_id: string): Promise<User[]>;
  findAllFromUserInPastDate(user_id: string): Promise<User[]>;
  findAllFromUserInFutureDate(user_id: string): Promise<User[]>;
  findAllFromUserInThisEnterprise(
    user_id: string,
    enterprise_id: string,
  ): Promise<User[]>;
  usersInService(service_id: string, service_date: Date): Promise<User[]>;
  findByServiceAndUserId(
    user_id: string,
    service_id: string,
  ): Promise<User | undefined>;
}
