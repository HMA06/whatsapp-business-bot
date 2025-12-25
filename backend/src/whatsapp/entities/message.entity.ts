import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Tenant } from '../../tenants/entities/tenant.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  from: string;

  @Column({ type: 'text' })
  content: string;

  @Column()
  senderName: string;

  @Column({ default: 'received' }) // 'received' or 'sent'
  type: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Tenant)
  tenant: Tenant;

  @Column()
  tenantId: number;
}