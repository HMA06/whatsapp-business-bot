import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  UseInterceptors, 
  UploadedFile, 
  UseGuards 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TenantsService } from './tenants.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tenants')
@UseGuards(JwtAuthGuard) // حماية جميع الروابط بالتوكن
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  async create(@Body() createTenantDto: { name: string; domain?: string }) {
    return this.tenantsService.create(createTenantDto);
  }

  @Get()
  async findAll() {
    return this.tenantsService.findAll();
  }

  // ✅ الرابط المفقود لاجتياز الاختبار الثاني
  @Get(':tenantId/messages')
  async getMessages(@Param('tenantId') tenantId: string) {
    return this.tenantsService.getMessagesByTenant(+tenantId);
  }

  @Get(':tenantId/knowledge')
  async getKnowledge(@Param('tenantId') tenantId: string) {
    return this.tenantsService.getKnowledgeBase(+tenantId);
  }

  @Post(':tenantId/knowledge')
  async addKnowledge(
    @Param('tenantId') tenantId: string,
    @Body() data: { question: string; answer: string },
  ) {
    return this.tenantsService.addKnowledge(+tenantId, data.question, data.answer);
  }

  // رابط رفع ملفات الـ PDF الذي نجحنا به سابقاً
  @Post(':tenantId/upload-pdf')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPdf(
    @Param('tenantId') tenantId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.tenantsService.processPdf(+tenantId, file);
  }
}