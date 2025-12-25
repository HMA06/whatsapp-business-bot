import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseAuthService {
  public client: SupabaseClient;
  public adminClient: SupabaseClient;

  constructor() {
    this.client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
    );

    this.adminClient = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }

  register(email: string, password: string) {
    return this.client.auth.signUp({ email, password });
  }

  login(email: string, password: string) {
    return this.client.auth.signInWithPassword({
      email,
      password,
    });
  }

  me(token: string) {
    return this.client.auth.getUser(token);
  }
}
