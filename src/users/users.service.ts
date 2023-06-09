import { ForbiddenException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashService } from '../auth/hash/hash.service';
import { FindUsersDto } from './dto/find-users.dto';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
    private hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if ((await this.findByUsername(createUserDto.username)) !== null) {
      throw new ForbiddenException(
        'Пользователь с таким именем уже зарегистрирован',
      );
    }
    if ((await this.findByEmail(createUserDto.email)) !== null) {
      throw new ForbiddenException(
        'Пользователь с такой почтой уже зарегистрирован',
      );
    }
    const user = this.usersRepository.create(createUserDto);
    user.password = await this.hashService.generateHash(user.password);
    return await this.usersRepository.save(user);
  }

  async findOne(id: number): Promise<User> {
    return await this.usersRepository.findOneBy({ id });
  }

  findMany({ query }: FindUsersDto): Promise<User[]> {
    return this.usersRepository.find({
      where: [{ email: query }, { username: query }],
    });
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.username) {
      const checkUserByName = await this.findByUsername(updateUserDto.username);
      if (checkUserByName !== null && checkUserByName.id !== id) {
        throw new ForbiddenException(
          'Пользователь с таким именем уже зарегистрирован',
        );
      }
    }

    if (updateUserDto.email) {
      const checkUserByEmail = await this.findByEmail(updateUserDto.email);
      if (checkUserByEmail !== null && checkUserByEmail.id !== id) {
        throw new ForbiddenException(
          'Пользователь с такой почтой уже зарегистрирован',
        );
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await this.hashService.generateHash(
        updateUserDto.password,
      );
    }

    await this.usersRepository.update({ id }, updateUserDto);
    const updatedOne = await this.findOne(id);
    delete updatedOne.password;
    return updatedOne;
  }

  async findByUsername(username: string) {
    return await this.usersRepository.findOne({
      where: {
        username: username,
      },
    });
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async remove(id: number) {
    return await this.usersRepository.delete({ id });
  }

  async getWishes(id: number) {
    return await this.wishesRepository.find({
      where: { owner: { id } },
      relations: ['owner'],
    });
  }
}
