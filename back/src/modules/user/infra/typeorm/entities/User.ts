import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import Room from '@modules/room/infra/typeorm/entities/Room';
import UsersRoom from '@modules/usersRoom/infra/typeorm/entities/UsersRoom';

@Entity('users', { schema: 'beeginscrum' })
export default class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Room, rooms => rooms.admin)
  admin: Room[];

  @OneToMany(() => UsersRoom, rooms => rooms.user)
  usersRoom: UsersRoom[];
}
