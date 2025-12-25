import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Tenant } from './tenants/entities/tenant.entity';
import { User } from './users/entities/user.entity';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  console.log('🚀 Attempting to connect to Supabase...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    const tenantRepo = dataSource.getRepository(Tenant);
    const userRepo = dataSource.getRepository(User);

    // 1. إنشاء الشركة الأساسية
    let mainTenant = await tenantRepo.findOneBy({ name: 'SmartBiz Main' });
    if (!mainTenant) {
      mainTenant = tenantRepo.create({ name: 'SmartBiz Main' });
      await tenantRepo.save(mainTenant);
      console.log('✅ Tenant created successfully');
    }

    // 2. إنشاء مستخدم الإدارة
    const adminEmail = 'admin@test.com';
    let adminUser = await userRepo.findOneBy({ email: adminEmail });
    
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      adminUser = userRepo.create({
        email: adminEmail,
        password: hashedPassword,
        tenant: mainTenant, // ربط المستخدم بالشركة
      });
      await userRepo.save(adminUser);
      console.log('✅ Admin User created: admin@test.com / 123456');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

  } catch (error) {
    console.error('❌ Database Error:', error.message);
  } finally {
    await app.close();
    process.exit();
  }
}

bootstrap();