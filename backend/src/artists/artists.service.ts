import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq, ilike, and, or, SQL, count } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../database/database.module';
import * as schema from '../schema';
import { CreateArtistDto } from './dto/create-artist.dto';
import { QueryArtistDto } from './dto/query-artist.dto';

type DB = NodePgDatabase<typeof schema>;

@Injectable()
export class ArtistsService {
  constructor(@Inject(DRIZZLE) private readonly db: DB) {}

  async findAll(query: QueryArtistDto) {
    const { search, category, block, availability, page = 1, limit = 20 } = query;
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];

    if (search) {
      conditions.push(
        or(
          ilike(schema.artists.name, `%${search}%`),
          ilike(schema.artists.nameBn, `%${search}%`),
          ilike(schema.artists.famousSong, `%${search}%`),
          ilike(schema.artists.address, `%${search}%`),
        )!,
      );
    }
    if (category) conditions.push(eq(schema.artists.category, category));
    if (block)    conditions.push(ilike(schema.artists.block, `%${block}%`));
    if (availability !== undefined) conditions.push(eq(schema.artists.availability, availability));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [items, [{ count: totalRaw }]] = await Promise.all([
      this.db.query.artists.findMany({
        where,
        with: { sampleWorks: true },
        limit,
        offset,
        orderBy: (a, { desc }) => [desc(a.createdAt)],
      }),
      this.db.select({ count: count() }).from(schema.artists).where(where),
    ]);

    const total = Number(totalRaw);

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const artist = await this.db.query.artists.findFirst({
      where: eq(schema.artists.id, id),
      with: { sampleWorks: true, bookings: { limit: 5 } },
    });
    if (!artist) throw new NotFoundException(`Artist ${id} not found`);
    return artist;
  }

  async create(dto: CreateArtistDto) {
    const [artist] = await this.db.insert(schema.artists).values(dto).returning();
    return artist;
  }

  async update(id: string, dto: Partial<CreateArtistDto>) {
    await this.findOne(id); // throws 404 if not found
    const [updated] = await this.db
      .update(schema.artists)
      .set({ ...dto, updatedAt: new Date() })
      .where(eq(schema.artists.id, id))
      .returning();
    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.db.delete(schema.artists).where(eq(schema.artists.id, id));
    return { message: 'Artist deleted successfully' };
  }

  async addSampleWork(artistId: string, dto: {
    title: string;
    titleBn?: string;
    type: string;
    mediaUrl: string;
    thumbnail?: string;
    duration?: string;
  }) {
    await this.findOne(artistId); // throws 404 if artist not found
    const [work] = await this.db
      .insert(schema.artistSampleWorks)
      .values({ ...dto, artistId })
      .returning();
    return work;
  }

  async removeSampleWork(artistId: string, workId: string) {
    const [work] = await this.db
      .select()
      .from(schema.artistSampleWorks)
      .where(
        and(
          eq(schema.artistSampleWorks.id, workId),
          eq(schema.artistSampleWorks.artistId, artistId),
        ),
      )
      .limit(1);
    if (!work) throw new NotFoundException(`Sample work ${workId} not found`);
    await this.db
      .delete(schema.artistSampleWorks)
      .where(eq(schema.artistSampleWorks.id, workId));
    return { message: 'Sample work deleted' };
  }
}
