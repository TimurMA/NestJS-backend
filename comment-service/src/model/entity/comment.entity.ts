import { BeforeInsert, Column, Entity, PrimaryColumn, Unique } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
@Entity()
@Unique(['id'])
export class Comment {
  @PrimaryColumn()
  id: string;

  @Column()
  comment: string;

  @Column({ name: 'user_id' })
  userId: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
