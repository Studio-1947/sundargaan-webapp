import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../database/database.module';
import * as schema from '../schema';
import { CreateBookingDto } from './dto/create-booking.dto';

type DB = NodePgDatabase<typeof schema>;

@Injectable()
export class BookingsService {
  constructor(@Inject(DRIZZLE) private readonly db: DB) {}

  async create(dto: CreateBookingDto) {
    const [booking] = await this.db
      .insert(schema.bookings)
      .values({
        ...dto,
        eventDate: dto.eventDate ? new Date(dto.eventDate) : undefined,
      })
      .returning();
    return booking;
  }

  async findAll() {
    return this.db.query.bookings.findMany({
      with: { artist: { columns: { id: true, name: true, nameBn: true } } },
      orderBy: (b, { desc }) => [desc(b.createdAt)],
    });
  }

  async findOne(id: string) {
    const booking = await this.db.query.bookings.findFirst({
      where: eq(schema.bookings.id, id),
      with: { artist: true },
    });
    if (!booking) throw new NotFoundException(`Booking ${id} not found`);
    return booking;
  }

  async updateStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed') {
    await this.findOne(id);
    const [updated] = await this.db
      .update(schema.bookings)
      .set({ status, updatedAt: new Date() })
      .where(eq(schema.bookings.id, id))
      .returning();
    return updated;
  }
}
