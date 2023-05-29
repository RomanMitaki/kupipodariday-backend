import {
  IsDate,
  IsEmail,
  IsInt,
  IsOptional,
  IsUrl,
  Length,
} from 'class-validator';

export class UserProfileResponseDto {
  @IsInt()
  id: number;

  @Length(2, 30)
  username: string;

  @IsOptional()
  @Length(2, 200)
  about: string;

  @IsOptional()
  @IsUrl()
  avatar: string;

  @IsEmail()
  email: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
