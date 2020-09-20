import User from '@modules/user2/infra/typeorm/schemas/User';
import {
  Entity,
  ObjectIdColumn,
  ObjectID,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('room')
class Room {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  topic: string;

  @Column(type => User)
  adm_id: User;

  @Column({ default: false })
  private: boolean;

  @Column()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Room;
