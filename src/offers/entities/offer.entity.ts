import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsBoolean, IsDate, IsNumber } from 'class-validator';

@Entity({ schema: 'kupipodariday' })
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  // @Column()
  // user

  // @Column()
  // item

  @Column({ type: 'decimal', scale: 2 })
  @IsNumber()
  amount: number;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;
}
