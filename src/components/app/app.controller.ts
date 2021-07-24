import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller('app')
export class AppController {
  private readonly start: number;
  constructor(private readonly appService: AppService) {
    this.start = Date.now();
  }

  @ApiOkResponse({ description: 'check uptime' })
  @Get('/healthcheck')
  healthcheck() {
    return this.appService.healthcheck(this.start);
  }
}
