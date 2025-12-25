import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Tenant } from '../../tenants/entities/tenant.entity';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'free' }) // الباقة: free, basic, pro
  plan: string;

  @Column({ default: 'active' }) // الحالة: active, expired, canceled
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startDate: Date;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP + interval '30 days'" })
  endDate: Date;

  @Column({ default: 1000 }) // الحد الأقصى للرسائل
  messageLimit: number;

  @Column({ default: 0 }) // الرسائل المستهلكة
  usedMessages: number;

  @OneToOne(() => Tenant)
  @JoinColumn()
  tenant: Tenant;

  @Column()
  tenantId: number;

  @CreateDateColumn()
  createdAt: Date;
}