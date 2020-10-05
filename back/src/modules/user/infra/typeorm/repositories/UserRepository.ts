import {
  Repository,
  getRepository,
  Raw,
  Between,
  MoreThanOrEqual,
  LessThan,
} from 'typeorm';

import ICreateAppointmentDTO from '@modules/room/dtos/ICreateRoomDTO';
import IFindAllInMonthFromProviderDTO from '@modules/room/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllUserAppoinrmentFromEnterpriseDTO from '@modules/room/dtos/IFindAllUserAppoinrmentFromEnterpriseDTO';
import ICreateUserDTO from '@modules/user/dtos/ICreateUserDTO';
import User from '../entities/User';
import Users from '../entities/User';
import IUserRepository from '@modules/user/repositories/IUserRepository';

class UserRepository implements IUserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<User | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date, provider_id },
    });

    return findAppointment;
  }

  public async findById(id: string): Promise<User | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { id },
    });

    return findAppointment;
  }

  public async remove(data: ICreateAppointmentDTO): Promise<User> {
    await this.ormRepository.remove(data);
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<User[]> {
    const parsedMonth = String(month).padStart(2, '0');
    const appointments = this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName},'MM-YYYY') = '${parsedMonth}-${year}'`,
        ),
      },
    });

    return appointments;
  }

  public async searchAllAppointmentsFromUserBetweenDate({
    createAt,
    expirationAt,
    user_id,
    enterprise_id,
  }: IFindAllUserAppoinrmentFromEnterpriseDTO): Promise<User[]> {
    const appointments = this.ormRepository.find({
      where: {
        user_id,
        enterprise_id,
        date: Between(createAt, expirationAt),
      },
    });

    return appointments;
  }

  public async findAllFromUser(user_id: string): Promise<User[]> {
    const appointments = this.ormRepository.find({
      where: {
        user_id,
      },
      relations: ['user', 'service'],
    });

    return appointments;
  }

  public async findAllFromUserInFutureDate(user_id: string): Promise<User[]> {
    const appointments = this.ormRepository.find({
      where: {
        user_id,
        date: MoreThanOrEqual(new Date()),
      },
      relations: [
        'user',
        'service',
        'enterprise',
        'service.appointments',
        'service.appointments.user',
      ],
      order: {
        date: 'ASC',
      },
    });

    return appointments;
  }

  public async findAllFromUserInPastDate(user_id: string): Promise<User[]> {
    const appointments = this.ormRepository.find({
      where: {
        user_id,
        date: LessThan(new Date()),
      },
      relations: [
        'user',
        'service',
        'enterprise',
        'service.appointments',
        'service.appointments.user',
      ],
      order: {
        date: 'ASC',
      },
    });

    return appointments;
  }

  public async findAllFromUserInThisEnterprise(
    user_id: string,
    enterprise_id: string,
  ): Promise<User[]> {
    const appointments = this.ormRepository.find({
      where: {
        user_id,
        enterprise_id,
      },
      relations: ['user', 'service'],
    });

    return appointments;
  }

  public async findByServiceAndUserId(
    user_id: string,
    service_id: string,
  ): Promise<User | undefined> {
    const appointments = this.ormRepository.findOne({
      where: {
        user_id,
        service_id,
        date: MoreThanOrEqual(new Date()),
      },
      relations: ['user', 'service'],
    });

    return appointments;
  }

  public async usersInService(
    service_id: string,
    service_date: Date,
  ): Promise<User[]> {
    const numberOfAppointment = await this.ormRepository.find({
      relations: ['user', 'service'],
      where: {
        service_id,
        date: Raw(
          dateFieldName =>
            `DATE(${dateFieldName}) = DATE('${new Date(
              service_date,
            ).toISOString()}')`,
        ),
      },
    });
    // .query(`
    // SELECT * from appointments where service_id = '${service_id}' and DATE(date) = DATE('${new Date(
    //   service_date,
    // ).toISOString()}')
    // `);

    return numberOfAppointment;
  }

  public async create({ name }: ICreateUserDTO): Promise<Users> {
    const user = this.ormRepository.create({
      name,
    });

    await this.ormRepository.save(user);

    return user;
  }
}

export default UserRepository;
