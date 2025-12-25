import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseAuthService } from './supabase-auth.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'SUPABASE_CLIENT',
      inject: [ConfigService],
      useFactory: (config: ConfigService): SupabaseClient => {
        const url = config.get<string>('SUPABASE_URL');
        const key =
          config.get<string>('SUPABASE_SERVICE_ROLE_KEY') ||
          config.get<string>('SUPABASE_KEY');

        if (!url || !key) {
          throw new Error('SUPABASE_URL or SUPABASE_KEY is missing');
        }

        return createClient(url, key);
      },
    },
    SupabaseAuthService,
  ],
  exports: ['SUPABASE_CLIENT', SupabaseAuthService],
})
export class SupabaseAuthModule {}
