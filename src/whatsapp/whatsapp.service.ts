import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Client, LocalAuth, Message as WhatsappMessage } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
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

    this.client.on('qr', (qr) => {
        // سيظل يطبع في الـ CMD للسيرفر لتمسحه من هناك أول مرة
        qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => this.logger.log(`Tenant ${tenantId} Ready!`));

    this.client.on('message', async (msg: WhatsappMessage) => {
      if (msg.from === 'status@broadcast' || msg.fromMe) return;

      try {
        const sub = await this.subscriptionRepo.findOne({ where: { tenantId } });
        if (!sub || sub.status !== 'active') return;

        const knowledge = await this.tenantsService.getKnowledgeBase(tenantId);
        let knowledgeText = knowledge.map(k => k.answer).join('\n\n');
        if (knowledgeText.length > 10000) {
            knowledgeText = knowledgeText.substring(0, 10000) + '...';
        }

        const completion = await this.openai.chat.completions.create({
          model: 'meta-llama/llama-3.2-3b-instruct:free',
          messages: [
            { role: 'system', content: `أنت مساعد لشركة SmartBiz. أجب باختصار وبالعربية من النص التالي:\n${knowledgeText}` },
            { role: 'user', content: msg.body },
          ],
          temperature: 0.1,
        });

        const reply = completion.choices?.[0]?.message?.content;
        if (reply) {
            await msg.reply(reply);
            sub.usedMessages += 1;
            await this.subscriptionRepo.save(sub);
        }
      } catch (e) {
        this.logger.error('System Error: ', e.message);
      }
    });

    this.client.initialize();
    return { message: 'Connecting... Check Server Logs for QR' };
  }
}