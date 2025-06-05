import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { Request as ExRequest } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserWithoutPassword } from 'src/common/types/user.type';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<{ message: string }> {
    await this.authService.register(registerDto);
    return { message: 'User registered successfully' };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: ExRequest) {
    return this.authService.login(req.user as UserWithoutPassword);
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  logout(@Request() req: ExRequest): Promise<void> {
    return new Promise((resolve) => {
      req.logout(() => {
        resolve();
      });
    });
  }

  // implement refresh token api
  // use refresh token strategy here to validate the refresh token
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh-token')
  refreshToken(@Request() req: ExRequest): { access_token: string; refresh_token: string } {
    const user = req.user as UserWithoutPassword;
    return this.authService.login(user);
  }
}
