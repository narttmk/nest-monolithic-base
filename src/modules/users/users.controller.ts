import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';
import { removeSensitiveUserData } from 'src/common/utils/user.util';

@UseGuards(JwtAuthGuard) // Assuming JwtAuthGuard is defined in your auth module
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getCurrentUser(@Request() req: ExpressRequest) {
    const user = await this.usersService.getUserById(req.user?.id as string);
    return removeSensitiveUserData(user);
  }
}
