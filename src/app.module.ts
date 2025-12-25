import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TenantsModule } from './tenants/tenants.module';
import { WhatsappModule } from './whatsapp/whatsapp.module'; // [ADDED]
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    TenantsModule,
    WhatsappModule, // [ADDED] ربط موديول الواتساب بالنظام
    SubscriptionsModule,

    // DB
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const host = config.get<string>('DB_HOST');
        const port = config.get<string>('DB_PORT');
        const user = config.get<string>('DB_USER');
        const pass = config.get<string>('DB_PASSWORD');
        const name = config.get<string>('DB_NAME');

        console.log('DB FROM ENV =>', { host, port, user, pass, name });

        return {
          type: 'postgres',
          host,
          port: Number(port),
          username: user,
          password: pass,
          database: name,
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
  ],
})
export class AppModule {}