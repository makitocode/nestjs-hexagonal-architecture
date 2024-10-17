import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../../users/application/services/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.getUserByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(username: string, email: string, password: string) {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      // Create the user via UserService
      await this.userService.createUser(username, email, hashedPassword);
      return { message: 'User successfully registered' };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('Username or email already exists');
      } else {
        throw new InternalServerErrorException('Error occurred during registration');
      }
    }
  }
}