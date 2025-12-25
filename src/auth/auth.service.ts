import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/roles.entity';
import { UserRole } from '../user-roles/entities/user-role.entity';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,

    @InjectRepository(UserRole)
    private readonly userRolesRepository: Repository<UserRole>,

    private readonly jwtService: JwtService,
  ) {}

  // --------------------------------------------------
  // REGISTER
  // --------------------------------------------------
  async register(dto: RegisterDto) {
    const { name, email, password, tenantId } = dto;

    // Check duplicate email
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
      tenantId,
    });

    await this.usersRepository.save(user);

    // Ensure "user" role exists for tenant
    let role = await this.rolesRepository.findOne({
      where: { name: 'user', tenantId },
    });

    if (!role) {
      role = this.rolesRepository.create({
        name: 'user',
        description: 'Default user role',
        tenantId,
      });

      await this.rolesRepository.save(role);
    }

    // Assign role to user
    const userRole = this.userRolesRepository.create({
      tenantId,
      user,
      role,
    });

    await this.userRolesRepository.save(userRole);

    return {
      message: 'User registered successfully',
      user,
    };
  }

  // --------------------------------------------------
  // LOGIN
  // --------------------------------------------------
  async login(dto: LoginDto) {
    const { email, password } = dto;

    // Fetch user
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Compare password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Payload
    const payload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
    };

    // Tokens
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    });

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  // --------------------------------------------------
  // REFRESH TOKEN
  // --------------------------------------------------
  async refresh(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });

      const newAccessToken = this.jwtService.sign(
        {
          sub: decoded.sub,
          email: decoded.email,
          tenantId: decoded.tenantId,
        },
        {
          expiresIn: '15m',
        },
      );

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
