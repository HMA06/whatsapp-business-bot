import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // IMPORTANT: نوقفه لأننا نستخدم Migrations
  logging: true,
});