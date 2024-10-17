import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { IUserRepository } from '../../domain/interfaces/user-repository.interface';
import { User } from '../../domain/model/user.model';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>
  ) { }

  async findById(id: string): Promise<User> {
    const userEntity = await this.repository.findOne({ where: { id } });
    if (!userEntity) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.toDomain(userEntity);
  }

  async findByUsername(username: string): Promise<User> {
    const userEntity = await this.repository.findOne({ where: { username } });
    if (!userEntity) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return this.toDomain(userEntity);
  }

  async save(user: User): Promise<void> {
    try {
      const userEntity = this.toEntity(user);
      await this.repository.save(userEntity);
    } catch (error) {
      throw new InternalServerErrorException('Error saving the user to the database');
    }
  }

  private toDomain(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.username,
      entity.email,
      entity.password,
      entity.createdAt,
      entity.updatedAt
    );
  }

  private toEntity(user: User): UserEntity {
    const entity = new UserEntity();
    entity.id = user.id;
    entity.username = user.username;
    entity.email = user.email;
    entity.password = user.password;
    entity.createdAt = user.createdAt;
    entity.updatedAt = user.updatedAt;
    return entity;
  }
}