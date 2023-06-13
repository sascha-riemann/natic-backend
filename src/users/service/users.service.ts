import { Injectable } from '@nestjs/common';

import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { username },
    });
  }

  findBySearchTerm(searchTerm: string): Promise<User[] | undefined> {
    return this.usersRepository.find({
      where: [
        {
          username: searchTerm,
        },
        {
          email: searchTerm,
        },
        {
          firstName: searchTerm,
        },
        {
          lastName: searchTerm,
        },
      ],
    });
  }

  findById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ email });
  }
}
