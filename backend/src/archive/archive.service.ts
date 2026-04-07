import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq, ilike, and, SQL, count } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../database/database.module';
import * as schema from '../schema';
import { CreateArchiveItemDto } from './dto/create-archive-item.dto';

type DB = NodePgDatabase<typeof schema>;

export class QueryArchiveDto {
  search?:    string;
  category?:  string;
  subcategory?: string;
  mediaType?: string;
  page?:      number;
  limit?:     number;
}

@Injectable()
export class ArchiveService {
  constructor(@Inject(DRIZZLE) private readonly db: DB) {}

  async findAll(query: QueryArchiveDto) {
    const { search, category, subcategory, mediaType, page = 1, limit = 20 } = query;
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [eq(schema.archiveItems.isPublished, true)];

    if (search)      conditions.push(ilike(schema.archiveItems.title, `%${search}%`));
    if (category)    conditions.push(eq(schema.archiveItems.category, category as any));
    if (subcategory) conditions.push(ilike(schema.archiveItems.subcategory, `%${subcategory}%`));
    if (mediaType)   conditions.push(eq(schema.archiveItems.mediaType, mediaType as any));

    const where = and(...conditions);

    const [items, [{ count: totalRaw }]] = await Promise.all([
      this.db.query.archiveItems.findMany({
        where,
        with: { artist: { columns: { id: true, name: true, nameBn: true } } },
        limit,
        offset,
        orderBy: (a, { desc }) => [desc(a.createdAt)],
      }),
      this.db.select({ count: count() }).from(schema.archiveItems).where(where),
    ]);

    const total = Number(totalRaw);

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const item = await this.db.query.archiveItems.findFirst({
      where: eq(schema.archiveItems.id, id),
      with: { artist: true },
    });
    if (!item) throw new NotFoundException(`Archive item ${id} not found`);
    return item;
  }

  async create(dto: CreateArchiveItemDto) {
    const [item] = await this.db.insert(schema.archiveItems).values(dto).returning();
    return item;
  }

  async update(id: string, dto: Partial<CreateArchiveItemDto>) {
    await this.findOne(id);
    const [updated] = await this.db
      .update(schema.archiveItems)
      .set({ ...dto, updatedAt: new Date() })
      .where(eq(schema.archiveItems.id, id))
      .returning();
    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.db.delete(schema.archiveItems).where(eq(schema.archiveItems.id, id));
    return { message: 'Archive item deleted successfully' };
  }
}
