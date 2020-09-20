import Appointment from '../infra/typeorm/entities/Room';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '../dtos/IFindAllInMonthFromProviderDTO';
import IFindAllUserAppoinrmentFromEnterpriseDTO from '../dtos/IFindAllUserAppoinrmentFromEnterpriseDTO';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>;
  findById(id: string): Promise<Appointment | undefined>;
  remove(data: ICreateAppointmentDTO): Promise<Appointment | undefined>;
  findAllInMonthFromProvider(
    data: IFindAllInMonthFromProviderDTO,
  ): Promise<Appointment[]>;
  searchAllAppointmentsFromUserBetweenDate(
    data: IFindAllUserAppoinrmentFromEnterpriseDTO,
  ): Promise<Appointment[]>;
  findAllFromUser(user_id: string): Promise<Appointment[]>;
  findAllFromUserInPastDate(user_id: string): Promise<Appointment[]>;
  findAllFromUserInFutureDate(user_id: string): Promise<Appointment[]>;
  findAllFromUserInThisEnterprise(
    user_id: string,
    enterprise_id: string,
  ): Promise<Appointment[]>;
  usersInService(
    service_id: string,
    service_date: Date,
  ): Promise<Appointment[]>;
  findByServiceAndUserId(
    user_id: string,
    service_id: string,
  ): Promise<Appointment | undefined>;
}
