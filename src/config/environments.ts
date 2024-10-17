export type NodeEnv = "LOCAL" | "DEV" | "PROD";

export interface Environment {
  ENV: NodeEnv;
  DELAY: string;
  LEASEVILLE_API_BASE_URL: string;
  LEASEVILLE_API_TOKEN: string;
  JWT_SECRET: string;
  REPLACE_ME_TOKEN: string;

  // Database
  DB_POSTGRES_HOST: string;
  DB_POSTGRES_PORT: string;
  DB_POSTGRES_NAME: string;
  DB_POSTGRES_USERNAME: string;
  DB_POSTGRES_PASSWORD: string;
  DB_POSTGRES_RETRY_DELAY: string;
  DB_POSTGRES_RETRY_ATTEMPTS: string;
  DB_CERT_PATH: string;

  // Redis
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_MAX_RETRIES: number;
  REDIS_RETRY_DELAY: number;

  // Optional
  SSL_CERT_PATH?: string;
  SSL_KEY_PATH?: string;
}
