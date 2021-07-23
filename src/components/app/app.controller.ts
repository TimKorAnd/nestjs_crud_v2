import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly start: number;
  constructor(private readonly appService: AppService) {
    this.start = Date.now();
  }

  @Get('app/healthcheck')
  healthcheck(): string {
    return this.appService.healthcheck(this.start);
  }
}
