import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: true })
  isActive: boolean;

  // تعريف العلاقة العكسية مع المستخدمين لإنهاء الخطأ
  @OneToMany(() => User, (user) => user.tenant)
  users: User[];
}