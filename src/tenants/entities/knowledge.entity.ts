import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Tenant } from './tenant.entity';

@Entity('knowledge_base')
export class Knowledge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  question: string;

  @Column({ type: 'text' })
  answer: string;

  @ManyToOne(() => Tenant)
  tenant: Tenant;

  @Column()
  tenantId: number;
}