import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/roles.entity';
import { UserRole } from '../user-roles/entities/user-role.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,

    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
  ) {}

  create(dto: CreateUserDto) {
    const user = this.usersRepository.create(dto);
    return this.usersRepository.save(user);
  }

  findAll() {
    return this.usersRepository.find();
  }

  async assignRole(userId: string, roleId: string, tenantId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const role = await this.rolesRepository.findOne({
      where: { id: roleId, tenantId },
    });
    if (!role) throw new Error('Role not found in this tenant');

    const userRole = this.userRoleRepository.create({
      tenantId,
      user: { id: userId },
      role: { id: roleId },
    });

    return this.userRoleRepository.save(userRole);
  }
}
