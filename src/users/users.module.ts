import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infrastructure/entities/user.entity';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { UserService } from './application/services/user.service';
import { IUserRepositoryToken } from './domain/interfaces/user-repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService,
    {
      provide: IUserRepositoryToken,
      useClass: UserRepository,
    }
  ],
  exports: [UserService],  // Export UserService if needed in other modules
})
export class UsersModule { }