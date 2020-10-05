import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

import UsersRoom from '@modules/usersRoom/infra/typeorm/entities/UsersRoom';
import Users from '@modules/user/infra/typeorm/entities/User';

@Index('users_room_user_id_fk', ['adm_id'], {})
@Entity('room', { schema: 'beeginscrum' })
export default class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { name: 'topic', length: 255, nullable: true })
  topic: string;

  @Column('varchar', { name: 'adm_id', length: 255 })
  adm_id: string;

  @Column('tinyint', {
    name: 'isPrivate',
    unsigned: true,
    default: () => "'0'",
  })
  isPrivate: number;

  @Column('varchar', { name: 'password', length: 255, nullable: true })
  password: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Users, user => user.admin, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'adm_id', referencedColumnName: 'id' }])
  admin: Users;

  @OneToMany(() => UsersRoom, usersRoom => usersRoom.room)
  usersRoom: UsersRoom[];
}
