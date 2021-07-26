import { Controller } from '@nestjs/common';
import { RedisCacheService } from './redis.cache.service';

@Controller('redis-cache')
export class RedisCacheController {
  constructor(private readonly redisCacheService: RedisCacheService) {}
}
