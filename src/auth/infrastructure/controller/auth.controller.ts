import { Controller, Post, Body, Request } from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() body: { username: string, password: string }) {
    return this.authService.login(body);
  }

  @Post('register')
  async register(@Body() body: { username: string, email: string, password: string }) {
    return this.authService.register(body.username, body.email, body.password);
  }
}