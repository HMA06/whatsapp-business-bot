import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Tenant } from './tenant.entity';

@Entity('knowledge_base')
export class KnowledgeBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  question: string;

  @Column({ type: 'text' })
  answer: string;

  @Column({ default: 'manual' }) // 'manual' للمدخلات اليدوية أو 'pdf' للملفات
  sourceType: string;

  @Column({ nullable: true })
  fileName: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column()
  tenantId: number;

  @CreateDateColumn()
  createdAt: Date;
}