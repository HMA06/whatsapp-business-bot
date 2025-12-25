import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Client, LocalAuth, Message as WhatsappMessage } from 'whatsapp-web.js';
import * as qrcodeTerminal from 'qrcode-terminal';
import * as QRCode from 'qrcode';
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
  private lastQr: string = "";

  constructor(
    @InjectRepository(MessageEntity)
    private messageRepo: Repository<MessageEntity>,
    @InjectRepository(Subscription)
    private subscriptionRepo: Repository<Subscription>,
    private tenantsService: TenantsService,
  ) {
    // إعداد OpenAI للتعامل مع OpenRouter
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
    });
  }

  onModuleInit() {
    this.logger.log('WhatsApp Service Initialized');
  }

  // دالة لجلب الرمز الحالي للفرونت إند
  getLatestQr() {
    return { qr: this.lastQr };
  }

  async connect(tenantId: number) {
    this.client = new Client({
      authStrategy: new LocalAuth({ 
        clientId: `tenant-${tenantId}`,
        dataPath: './.wwebjs_auth' 
      }),
      puppeteer: { 
        headless: true, 
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] 
      },
    });

    // توليد الرمز وتحويله لصورة
    this.client.on('qr', async (qr) => {
      qrcodeTerminal.generate(qr, { small: true });
      this.lastQr = await QRCode.toDataURL(qr);
      this.logger.log(`New QR Code generated for Tenant ${tenantId}`);
    });

    this.client.on('ready', () => {
      this.lastQr = "";
      this.logger.log(`WhatsApp Client for Tenant ${tenantId} is READY!`);
    });

    // المحرك الذكي للرد على الرسائل
    this.client.on('message', async (msg: WhatsappMessage) => {
      if (msg.from === 'status@broadcast' || msg.fromMe) return;

      try {
        // 1. التحقق من حالة اشتراك العميل
        const sub = await this.subscriptionRepo.findOne({ where: { tenantId } });
        if (!sub || sub.status !== 'active') return;

        // 2. جلب "قاعدة المعرفة" الخاصة بالشركة من السوبابيس
        const knowledge = await this.tenantsService.getKnowledgeBase(tenantId);
        
        // تحويل المعرفة إلى سياق نصي للذكاء الاصطناعي
        let context = "المعلومات المتاحة عن الشركة:\n";
        knowledge.forEach(k => {
          context += `السؤال: ${k.question} | الإجابة: ${k.answer}\n`;
        });

        // 3. إرسال السؤال للذكاء الاصطناعي (Llama 3.2) مع السياق
        const completion = await this.openai.chat.completions.create({
          model: 'meta-llama/llama-3.2-3b-instruct:free',
          messages: [
            { 
              role: 'system', 
              content: `أنت مساعد ذكي لخدمة العملاء. أجب باللغة العربية حصراً وبناءً على المعلومات التالية فقط:\n${context}` 
            },
            { role: 'user', content: msg.body },
          ],
          temperature: 0.3,
        });

        const reply = completion.choices?.[0]?.message?.content;

        if (reply) {
          // 4. إرسال الرد للعميل
          await msg.reply(reply);

          // 5. تحديث إحصائيات الرسائل المستخدمة
          sub.usedMessages += 1;
          await this.subscriptionRepo.save(sub);

          // 6. حفظ الرسالة في السجل للرجوع إليها في الـ CRM
          await this.messageRepo.save({
            tenantId,
            from: msg.from,
            body: msg.body,
            reply: reply,
            timestamp: new Date()
          });
        }
      } catch (e) {
        this.logger.error('Error handling message: ', e.message);
      }
    });

    this.client.initialize();
  }
}