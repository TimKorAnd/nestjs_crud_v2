import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get(key) {
    await this.cache.get(key);
  }

  async set(key, value, ttlOptions = { ttl: 3600 }) {
    key = key.toString();
    await this.cache.set(key, value, ttlOptions);
  }
}
