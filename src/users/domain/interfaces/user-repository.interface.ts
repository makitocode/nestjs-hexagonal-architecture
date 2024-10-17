import { User } from '../model/user.model';

export interface IUserRepository {
  findById(id: string): Promise<User>;
  findByUsername(username: string): Promise<User>;
  save(user: User): Promise<void>;
}