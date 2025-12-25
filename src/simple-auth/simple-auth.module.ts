import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SimpleAuthController } from './simple-auth.controller';
import { SimpleAuthService } from './simple-auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'TEST_SECRET',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [SimpleAuthController],
  providers: [SimpleAuthService],
})
export class SimpleAuthModule {}
