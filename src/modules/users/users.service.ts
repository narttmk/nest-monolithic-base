import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UserRepository) {}

  async getUserByEmail(email: string) {
    return this.usersRepository.findOne({ email });
  }

  async getUserById(id: string) {
    return this.usersRepository.findOne({ id });
  }

  async create(data: Prisma.UserCreateInput) {
    return this.usersRepository.create(data);
  }
}
