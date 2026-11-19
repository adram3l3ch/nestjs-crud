import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity.js';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  originalName: string;

  @Column()
  mimeType: string;

  @Column()
  size: number;

  @Column()
  url: string;

  @Column()
  publicId: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, { eager: true })
  uploader: User;

  @CreateDateColumn()
  createdAt: Date;
}
