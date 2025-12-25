import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface SimpleUser {
  id: number;
  email: string;
  password: string;
  tenantId: number;
  role: string;
}

@Injectable()
export class SimpleAuthService {
  private users: SimpleUser[] = [];

  constructor(private readonly jwtService: JwtService) {}

  register(email: string, password: string, tenantId: number, role: string) {
    const exists = this.users.find((u) => u.email === email);
    if (exists) throw new UnauthorizedException('User exists');

    const user: SimpleUser = {
      id: this.users.length + 1,
      email,
      password,
      tenantId,
      role,
    };

    this.users.push(user);
    return { message: 'User registered', user };
  }

  login(email: string, password: string) {
    const user = this.users.find((u) => u.email === email && u.password === password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({
      sub: user.id,
      tenantId: user.tenantId,
      role: user.role,
    });

    return { access_token: token };
  }
}
