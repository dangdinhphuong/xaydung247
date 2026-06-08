import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SettingsService } from '../settings/settings.service';
import { Counter, CounterDocument } from './schemas/counter.schema';

@Injectable()
export class CountersService {
  private readonly logger = new Logger(CountersService.name);

  constructor(
    @InjectModel(Counter.name) private readonly model: Model<CounterDocument>,
    private readonly settings: SettingsService,
  ) {}

  /** Tăng seq nguyên tử. Bắt E11000 ở lần upsert đầu, retry 1 lần. */
  async nextSeq(key: string): Promise<number> {
    try {
      const c = await this.model.findOneAndUpdate(
        { _id: key },
        { $inc: { seq: 1 } },
        { upsert: true, new: true },
      );
      return c!.seq;
    } catch (err: any) {
      if (err?.code === 11000) {
        this.logger.warn(`Counter ${key} E11000 → retry 1 lần`);
        const retry = await this.model.findOneAndUpdate(
          { _id: key },
          { $inc: { seq: 1 } },
          { new: true },
        );
        if (!retry) throw err;
        return retry.seq;
      }
      throw err;
    }
  }

  async allocateInvoiceNumber(year: number): Promise<string> {
    const seq = await this.nextSeq(`invoice-${year}`);
    const s = await this.settings.get();
    const padded = String(seq).padStart(3, '0');
    return `${s.invoicePrefix}${year}-${padded}`;
  }

  async allocateQuotationNumber(year: number): Promise<string> {
    const seq = await this.nextSeq(`quotation-${year}`);
    const s = await this.settings.get();
    const padded = String(seq).padStart(3, '0');
    return `${s.quotationPrefix}${year}-${padded}`;
  }

  async ensureCounter(key: string): Promise<void> {
    await this.model.updateOne(
      { _id: key },
      { $setOnInsert: { seq: 0 } },
      { upsert: true },
    );
  }
}
