import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: any) {
    return this.usersService.create(dto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Put(':id/role')
  assignRole(@Param('id') id: string, @Body() dto: any) {
    // تم إضافة + قبل role_id و tenantId لتحويلهم إلى أرقام وحل الخطأ
    return this.usersService.assignRole(id, +dto.role_id, +dto.tenantId);
  }
}