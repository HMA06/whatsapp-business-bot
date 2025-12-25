import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../user-roles/entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>, // ✅ Role واحد
  ) {}

  async create(dto: CreateRoleDto): Promise<Role> {
    const role: Role = this.rolesRepository.create(dto); // ✅ ليس Array
    return this.rolesRepository.save(role);              // ✅ يرجع Role
  }

  async findAll(): Promise<Role[]> {
    return this.rolesRepository.find();
  }
}
