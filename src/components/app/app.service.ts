import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthcheck(start: number): any {
    return {
      status: 'nestjs CRUD API Online',
      uptime: Number((Date.now() - start) / 1000).toFixed(0),
    };
  }
}
