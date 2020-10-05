import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import Room from '@modules/room/infra/typeorm/entities/Room';

import Users from '@modules/user/infra/typeorm/entities/User';

@Index('roomuser_user_id_fk', ['user_id'], {})
@Index('roomuser_room_id_fk', ['room_id'], {})
@Entity('usersRoom', { schema: 'beeginscrum' })
export default class UsersRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int', { name: 'vote', unsigned: true, nullable: true })
  vote: number;

  @Column('varchar', { name: 'user_id', length: 255 })
  user_id: string;

  @Column('varchar', { name: 'room_id', length: 255 })
  room_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Users, usersRoom => usersRoom.usersRoom, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: Users;

  @ManyToOne(() => Room, usersRoom => usersRoom.usersRoom, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'room_id', referencedColumnName: 'id' }])
  room: Room;
}
