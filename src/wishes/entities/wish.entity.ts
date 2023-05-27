import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Length, IsDate, IsUrl, IsNumber, IsInt } from 'class-validator';

@Entity({ schema: 'kupipodariday' })
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({ type: 'decimal', scale: 2 })
  @IsNumber()
  price: number;

  @Column({ type: 'decimal', scale: 2 })
  @IsNumber()
  raised: number;

  //@Column()
  //owner

  @Column()
  @Length(1, 1024)
  description: string;

  //@Column()
  //offers

  @Column()
  @IsInt()
  copied: number;
}
