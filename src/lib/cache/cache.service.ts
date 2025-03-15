import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  set(key: string, value: any, ttl?: number) {
    return this.cacheManager.set(key, value, ttl);
  }

  get<T>(key: string): T {
    return this.cacheManager.get(key) as T;
  }

  del(key: string) {
    return this.cacheManager.del(key);
  }
}
