import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(dto: any) {
    const newUser = this.usersRepository.create(dto);
    return this.usersRepository.save(newUser);
  }

  async findAll() {
    return this.usersRepository.find({ relations: ['userRoles'] });
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username }, relations: ['tenant'] });
  }

  async findById(userId: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id: parseInt(userId, 10) } });
  }

  async assignRole(userId: string, roleId: number, tenantId: number) {
    // كود منطق تعيين الرتبة هنا
    return { message: 'Role assigned successfully' };
  }
}