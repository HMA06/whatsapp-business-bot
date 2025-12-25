import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('reports')
export class ReportsController {
  constructor(private dataSource: DataSource) {}

  @Get()
  async getReports() {
    return this.dataSource.query('SELECT * FROM reports');
  }
}
