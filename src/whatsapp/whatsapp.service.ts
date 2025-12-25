import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Client, LocalAuth, Message as WhatsappMessage } from 'whatsapp-web.js';
import * as qrcodeTerminal from 'qrcode-terminal';
import * as QRCode from 'qrcode'; // مكتبة تحويل الرمز لصورة
import OpenAI from 'openai';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message as MessageEntity } from './entities/message.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { TenantsService } from '../tenants/tenants.service';

@Injectable()
export class WhatsappService implements OnModuleInit {
  private readonly logger = new Logger(WhatsappService.name);
  private client!: Client;
  private openai: OpenAI;
  private lastQr: string = ""; // متغير لحفظ الرمز كصورة

  constructor(
    @InjectRepository(MessageEntity)
    private messageRepo: Repository<MessageEntity>,
    @InjectRepository(Subscription)
    private subscriptionRepo: Repository<Subscription>,
    private tenantsService: TenantsService,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
    });
  }

  onModuleInit() {
    this.logger.log('WhatsApp Service Initialized');
  }

  // دالة لجلب آخر رمز تم توليده
  getLatestQr() {
    return { qr: this.lastQr };
  }

  async connect(tenantId: number) {
    this.client = new Client({
      authStrategy: new LocalAuth({ clientId: `tenant-${tenantId}` }),
      puppeteer: { 
        headless: true, 
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] 
      },
    });

    this.client.on('qr', async (qr) => {
      // طباعة في الـ CMD للاحتياط
      qrcodeTerminal.generate(qr, { small: true });
      
      // تحويل الرمز إلى Base64 ليظهر في المتصفح
      this.lastQr = await QRCode.toDataURL(qr);
      this.logger.log('New QR Code generated and ready for Frontend');
    });

    this.client.on('ready', () => {
        this.lastQr = ""; // تنظيف الرمز بعد النجاح
        this.logger.log(`Tenant ${tenantId} Ready!`);
    });

    this.client.on('message', async (msg: WhatsappMessage) => {
      if (msg.from === 'status@broadcast' || msg.fromMe) return;

      try {
        const sub = await this.subscriptionRepo.findOne({ where: { tenantId } });
        if (!sub || sub.status !== 'active') return;

        const knowledge = await this.tenantsService.getKnowledgeBase(tenantId);
        let knowledgeText = knowledge.map(k => k.answer).join('\n\n');
        
        const completion = await this.openai.chat.completions.create({
          model: 'meta-llama/llama-3.2-3b-instruct:free',
          messages: [
            { role: 'system', content: `أنت مساعد ذكي لشركة SmartBiz. أجب باختصار من النص: ${knowledgeText.substring(0, 5000)}` },
            { role: 'user', content: msg.body },
          ],
        });

        const reply = completion.choices?.[0]?.message?.content;
        if (reply) {
            await msg.reply(reply);
            sub.usedMessages += 1;
            await this.subscriptionRepo.save(sub);
        }
      } catch (e) {
        this.logger.error('Error in message handler: ', e.message);
      }
    });

    this.client.initialize();
  }
}
