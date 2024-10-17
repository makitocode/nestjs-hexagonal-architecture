import { RedisKey } from "../domain/redis.key";
import { RedisService } from "@liaoliaots/nestjs-redis";
import { Injectable, Logger } from "@nestjs/common";
import { Redis } from "ioredis";

export interface RedisKeyConfig {
  key: string;
  prefix?: string;
}

export interface RedisSetKeyConfig extends RedisKeyConfig {
  value: string;
  ttl?: number;
}

@Injectable()
export class RedisClientService {
  /**
   * The logger instance.
   * @private
   */
  private readonly logger = new Logger(RedisClientService.name);

  /**
   * The Redis client.
   * @private
   */
  private client: Redis;

  /**
   * Constructs an instance of the RedisClientService.
   * @param redisService
   */
  constructor(private redisService: RedisService) {
    this.client = this.redisService.getOrNil();
  }

  /**
   * Sets a redis field by key.
   * @param config
   */
  public async setKey(config: RedisSetKeyConfig): Promise<void> {
    const { value, ttl = -1 } = config;
    const key = this.createPrefixedKey(config);
    if (ttl === -1) {
      await this.client.set(key, value);
    } else {
      await this.client.set(key, value, "EX", ttl);
    }
  }

  /**
   * Gets a redis field by key.
   * @param config
   */
  public async getKey(config: RedisKeyConfig): Promise<string | null> {
    const key = this.createPrefixedKey(config);
    return this.client.get(key);
  }

  /**
   * Deletes a redis field by key.
   * @param config
   */
  public async deleteKey(config: RedisKeyConfig): Promise<void> {
    const key = this.createPrefixedKey(config);
    await this.client.del(key);
  }

  /**
   * Clears all product cache keys.
   */
  public async clearProductCache(): Promise<void> {
    const keys = await this.client.keys(`${RedisKey.PRODUCTS_LIST}:*`);
    this.logger.debug(`clearProductCache( Found keys: ${keys.join(", ")} )`);
    if (keys.length > 0) {
      await this.client.del(keys);
      this.logger.debug(`clearProductCache( Deleted ${keys.length} keys )`);
    } else {
      this.logger.debug("clearProductCache( No product cache keys found )");
    }
  }

  /**
   * Creates a prefixed key.
   * @param config
   * @private
   */
  private createPrefixedKey(config: RedisKeyConfig): string {
    return !!config.prefix ? `${config.prefix}_${config.key}` : config.key;
  }
}
