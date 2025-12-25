import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async create(data: any) {
    const newUser = this.usersRepo.create({
      username: data.username,
      password: data.password,
      tenantId: Number(data.tenantId),
      email: data.email || `${data.username}@smartbiz.ai`
    });
    return this.usersRepo.save(newUser);
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.usersRepo.findOne({ where: { username }, relations: ['tenant'] });
  }

  // ✅ إضافة الدالة الناقصة لجلب كل المستخدمين
  async findAll(): Promise<User[]> {
    return this.usersRepo.find({ relations: ['tenant'] });
  }

  // ✅ إضافة الدالة الناقصة لحذف مستخدم
  async remove(id: string): Promise<void> {
    await this.usersRepo.delete(id);
  }
}