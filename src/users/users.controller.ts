import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post(':id/assign-role')
  assignRole(
    @Param('id') id: string,
    @Body() dto: { role_id: string; tenantId: string },
  ) {
    return this.usersService.assignRole(id, dto.role_id, dto.tenantId);
  }
}
