import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as net from 'net';

export type ReadinessStatus = 'ready' | 'not_ready';
export type DependencyStatus = 'up' | 'down';

export interface ReadinessResult {
  status: ReadinessStatus;
  checks: {
    mongo: DependencyStatus;
    redis: DependencyStatus;
  };
}

@Injectable()
export class HealthService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async getReadiness(): Promise<ReadinessResult> {
    const [mongoOk, redisOk] = await Promise.all([this.checkMongo(), this.checkRedis()]);

    return {
      status: mongoOk && redisOk ? 'ready' : 'not_ready',
      checks: {
        mongo: mongoOk ? 'up' : 'down',
        redis: redisOk ? 'up' : 'down',
      },
    };
  }

  private async checkMongo(): Promise<boolean> {
    try {
      if (this.connection.readyState !== 1 || !this.connection.db) {
        return false;
      }

      await this.connection.db.admin().ping();
      return true;
    } catch {
      return false;
    }
  }

  private async checkRedis(): Promise<boolean> {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      return false;
    }

    try {
      const url = new URL(redisUrl);
      const host = url.hostname;
      const port = Number(url.port || 6379);

      return await this.checkTcpConnection(host, port);
    } catch {
      return false;
    }
  }

  private checkTcpConnection(host: string, port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const socket = net.createConnection({ host, port });
      let settled = false;

      const finish = (result: boolean) => {
        if (settled) return;
        settled = true;
        socket.destroy();
        resolve(result);
      };

      socket.setTimeout(2000);

      socket.on('connect', () => finish(true));
      socket.on('timeout', () => finish(false));
      socket.on('error', () => finish(false));
    });
  }
}
