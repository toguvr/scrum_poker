import {
  Entity,
  ObjectIdColumn,
  ObjectID,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('RoomUsers')
class RoomUsers {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  vote: number;

  @Column('uuid')
  user_id: string;

  @Column('uuid')
  room_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default RoomUsers;
