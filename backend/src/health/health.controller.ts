import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Public } from '../common/decorators/public.decorator';

@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly conn: Connection) {}

  @Public()
  @Get()
  check() {
    const mongoOk = this.conn.readyState === 1;
    return {
      ok: mongoOk,
      mongo: { readyState: this.conn.readyState },
      timestamp: new Date().toISOString(),
    };
  }
}
