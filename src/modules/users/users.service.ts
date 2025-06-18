import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { Prisma, User } from '@prisma/client';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UserRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getUserByEmail(email: string) {
    const cacheKey = `user:${email}`;
    const cachedUser = await this.cacheManager.get<User>(cacheKey);
    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.usersRepository.findOne({ email });
    if (user) {
      await this.cacheManager.set(cacheKey, user); // Cache for 1 hour
    }
    return user;
  }

  async getUserById(id: string) {
    return this.usersRepository.findOne({ id });
  }

  async create(data: Prisma.UserCreateInput) {
    return this.usersRepository.create(data);
  }
}
