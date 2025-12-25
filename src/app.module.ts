import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolePermissionsModule } from './role-permissions/role-permissions.module';
import { UserRolesModule } from './user-roles/user-roles.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    // PostgreSQL
    TypeOrmModule.forRoot({
  	type: 'postgres',
  	host: process.env.DB_HOST,
  	port: +process.env.DB_PORT,
  	username: process.env.DB_USER,
  	password: process.env.DB_PASSWORD,
  	database: process.env.DB_NAME,
  	autoLoadEntities: true,
	synchronize: true, // 🔥 مؤقت
    }),


    // Redis
   //RedisModule.forRoot({
     //type: 'single',
     //url: process.env.REDIS_URL,
    //}),


    // Bull Queue
    BullModule.registerQueue({
      name: 'email-queue',
    }),

    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    RolePermissionsModule,
    UserRolesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
