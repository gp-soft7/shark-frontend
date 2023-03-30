import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CallDetailsCache {
  private cache = new Map<string, any>();

  constructor() {}

  cacheCall(id: string, data: any) {
    this.cache.set(id, data);
  }

  getCachedCall(id: string) {
    return this.cache.get(id);
  }
}
