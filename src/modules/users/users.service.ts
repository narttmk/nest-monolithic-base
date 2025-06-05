import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UserRepository) {}

  async getUserByEmail(email: string) {
    return this.usersRepository.findOne({ email });
  }

  async getUserById(id: string) {
    return this.usersRepository.findOne({ id });
  }

  async create(data: RegisterDto) {
    return this.usersRepository.create(data);
  }
}
