import { Injectable } from '@nestjs/common';
import { User } from '../../domain/model/user.model';
import { IUserRepository } from '../../domain/interfaces/user-repository.interface';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: IUserRepository) { }

  async getUserById(id: string): Promise<User> {
    return this.userRepository.findById(id);
  }

  async getUserByUsername(username: string): Promise<User> {
    return this.userRepository.findByUsername(username);
  }

  async createUser(username: string, email: string, password: string): Promise<void> {
    const user = new User(null, username, email, password, new Date(), new Date());
    await this.userRepository.save(user);
  }
}