import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { genSalt, hashPassword } from 'src/common/utils/password.util';
import { UserWithoutPassword } from 'src/common/types/user.type';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAuthPayload } from 'src/common/types/auth.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<void> {
    const user = await this.usersService.getUserByEmail(registerDto.email);
    if (user) {
      throw new Error('User already exists');
    }
    registerDto.saltKey = await genSalt();
    registerDto.password = await hashPassword(registerDto.password, registerDto.saltKey);
    await this.usersService.create(registerDto);
  }

  async validateUser(username: string, pass: string): Promise<UserWithoutPassword | null> {
    const user = await this.usersService.getUserByEmail(username);
    if (user?.status !== 'active') {
      throw new UnauthorizedException('User is not active');
    }
    const hashedPassword = await hashPassword(pass, user.saltKey);
    if (user && user.password === hashedPassword) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: UserWithoutPassword) {
    const payload: JwtAuthPayload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'default@Refre5hSecretKey',
        expiresIn: '7d', // Set a longer expiration for refresh tokens
      }),
    };
  }
}
