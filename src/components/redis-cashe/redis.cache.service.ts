import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get(key: string): Promise<string> {
    return this.cache.get(key);
  }

  async set(key, value, options = { ttl: 3600 }): Promise<any> {
    key = key.toString();
    return this.cache.set(key, value, options);
  }

  async del(key: string): Promise<any> {
    key = key.toString();
    return this.cache.del(key);
  }
}
