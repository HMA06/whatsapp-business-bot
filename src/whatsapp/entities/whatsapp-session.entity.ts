import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Tenant } from '../../tenants/entities/tenant.entity';

@Entity('whatsapp_sessions')
export class WhatsAppSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  tenantId: number;

  @Column({ default: 'DISCONNECTED' })
  status: string; // INITIALIZING, QR_READY, CONNECTED, DISCONNECTED

  @Column({ type: 'text', nullable: true })
  qrCode: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @OneToOne(() => Tenant)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;
}