import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Tenant } from '../tenants/entities/tenant.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/entities/role.entity';
import { Permission } from '../users/entities/permission.entity';
import { WhatsAppSession } from '../whatsapp/entities/whatsapp-session.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: '127.0.0.1',
  port: 5436, // المنفذ الجديد للهرب من تعارضات النظام
  username: 'postgres',
  password: 'password',
  database: 'postgres',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
  logging: true,
};