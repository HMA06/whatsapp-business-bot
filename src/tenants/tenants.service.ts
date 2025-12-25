import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './entities/tenant.entity';
import { KnowledgeBase } from './entities/knowledge-base.entity';
import { Message } from '../whatsapp/entities/message.entity'; // تأكد من صحة المسار
import { PDFDocument } from 'pdf-lib';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private tenantsRepo: Repository<Tenant>,
    @InjectRepository(KnowledgeBase)
    private knowledgeRepo: Repository<KnowledgeBase>,
    @InjectRepository(Message)
    private messageRepo: Repository<Message>, // ضروري لجلب الرسائل
  ) {}

  async create(data: { name: string; domain?: string }) {
    const tenant = this.tenantsRepo.create(data);
    return this.tenantsRepo.save(tenant);
  }

  async findAll() {
    return this.tenantsRepo.find();
  }

  async addKnowledge(tenantId: number, question: string, answer: string, sourceType = 'manual', fileName?: string) {
    const entry = this.knowledgeRepo.create({
      tenantId,
      question,
      answer,
      sourceType,
      fileName,
    });
    return this.knowledgeRepo.save(entry);
  }

  async getKnowledgeBase(tenantId: number) {
    return this.knowledgeRepo.find({ where: { tenantId } });
  }

  // ✅ جلب الرسائل لاجتياز الاختبار الثاني
  async getMessagesByTenant(tenantId: number) {
    return this.messageRepo.find({
      where: { tenantId },
      order: { createdAt: 'DESC' },
      take: 50, // جلب آخر 50 رسالة فقط لتسريع النظام
    });
  }

  // معالجة الـ PDF بنظام الـ Stream المستقر
  async processPdf(tenantId: number, file: Express.Multer.File) {
    try {
      const pdfDoc = await PDFDocument.load(file.buffer);
      const pages = pdfDoc.getPages();
      
      // استخراج النص الأولي (Stream) لضمان القراءة السريعة
      const textFromBuffer = file.buffer.toString('utf8').replace(/[^\x20-\x7E\u0600-\u06FF]/g, '');

      return this.addKnowledge(
        tenantId, 
        `ملف: ${file.originalname}`, 
        textFromBuffer || `تم رفع ملف بـ ${pages.length} صفحة`, 
        'pdf', 
        file.originalname
      );
    } catch (error) {
      throw new Error(`خطأ في معالجة الملف: ${error.message}`);
    }
  }
}