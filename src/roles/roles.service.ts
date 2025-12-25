import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/roles.entity';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async create(dto: CreateRoleDto) {
    const role = this.rolesRepository.create(dto);
    return this.rolesRepository.save(role);
  }

  async findAll() {
    return this.rolesRepository.find();
  }
}
