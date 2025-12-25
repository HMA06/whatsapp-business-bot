import { Injectable, Logger } from '@nestjs/common';
import { Client, LocalAuth, Message as WhatsappMessage } from 'whatsapp-web.js';
import * as QRCode from 'qrcode';
import OpenAI from 'openai';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message as MessageEntity } from './entities/message.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { TenantsService } from '../tenants/tenants.service';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private client!: Client;
  private openai: OpenAI;
  private lastQr: string = "";

  constructor(
    @InjectRepository(MessageEntity) private messageRepo: Repository<MessageEntity>,
    @InjectRepository(Subscription) private subscriptionRepo: Repository<Subscription>,
    private tenantsService: TenantsService,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
    });
  }

  getLatestQr() { return { qr: this.lastQr }; }

  // ✅ دالة الإرسال اليدوي عبر الـ CRM
  async sendManual(tenantId: number, to: string, message: string) {
    if (!this.client) throw new Error('WhatsApp client not initialized');
    
    const formattedTo = to.includes('@c.us') ? to : `${to}@c.us`;
    await this.client.sendMessage(formattedTo, message);
    
    // حفظ الرسالة اليدوية في السجل لضمان مزامنة البيانات
    await this.messageRepo.save({
      tenantId,
      from: 'Manual-CRM',
      body: message,
      timestamp: new Date()
    });
    
    return { success: true };
  }

  async connect(tenantId: number) {
    this.client = new Client({
      authStrategy: new LocalAuth({ clientId: `tenant-${tenantId}` }),
      puppeteer: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] }
    });

    this.client.on('qr', async (qr) => {
      this.lastQr = await QRCode.toDataURL(qr);
    });

    this.client.on('message', async (msg: WhatsappMessage) => {
      if (msg.from === 'status@broadcast' || msg.fromMe) return;

      try {
        const sub = await this.subscriptionRepo.findOne({ where: { tenantId } });
        if (!sub || sub.status !== 'active') return;

        // جلب سياق الشركة من قاعدة المعرفة
        const knowledge = await this.tenantsService.getKnowledgeBase(tenantId);
        let context = knowledge.map(k => `س: ${k.question}\nج: ${k.answer}`).join('\n');

        const completion = await this.openai.chat.completions.create({
          model: 'meta-llama/llama-3.2-3b-instruct:free',
          messages: [
            { role: 'system', content: `أجب بناءً على هذه المعلومات فقط:\n${context}` },
            { role: 'user', content: msg.body },
          ],
        });

        const reply = completion.choices?.[0]?.message?.content;
        if (reply) {
          await msg.reply(reply);
          await this.messageRepo.save({ tenantId, from: msg.from, body: msg.body, reply, timestamp: new Date() });
        }
      } catch (e) { this.logger.error('Error:', e.message); }
    });

    this.client.initialize();
  }
}