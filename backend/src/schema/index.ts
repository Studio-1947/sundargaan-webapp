import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  pgEnum,
  jsonb,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const artistCategoryEnum = pgEnum('artist_category', [
  'baul',
  'folk_singer',
  'instrumentalist',
  'dancer',
  'storyteller',
  'craft_artisan',
]);

export const archiveCategoryEnum = pgEnum('archive_category', [
  'artists',
  'artefacts',
  'art_forms',
]);

export const archiveMediaTypeEnum = pgEnum('archive_media_type', [
  'image',
  'audio',
  'video',
  'document',
]);

export const bookingStatusEnum = pgEnum('booking_status', [
  'pending',
  'confirmed',
  'cancelled',
  'completed',
]);

// ─── Artists ──────────────────────────────────────────────────────────────────

export const artists = pgTable('artists', {
  id:             uuid('id').primaryKey().defaultRandom(),
  name:           varchar('name', { length: 255 }).notNull(),
  nameBn:         varchar('name_bn', { length: 255 }).notNull(),
  category:       artistCategoryEnum('category').notNull(),
  block:          varchar('block', { length: 100 }).notNull(),
  address:        text('address').notNull(),
  addressBn:      text('address_bn').notNull(),
  description:    text('description').notNull(),
  descriptionBn:  text('description_bn').notNull(),
  famousSong:     varchar('famous_song', { length: 255 }),
  famousSongBn:   varchar('famous_song_bn', { length: 255 }),
  instruments:    jsonb('instruments').$type<string[]>().default([]),
  instrumentsBn:  jsonb('instruments_bn').$type<string[]>().default([]),
  tags:           jsonb('tags').$type<string[]>().default([]),
  tagsBn:         jsonb('tags_bn').$type<string[]>().default([]),
  experience:     integer('experience').default(0),
  availability:   boolean('availability').default(true),
  imageUrl:       text('image_url'),
  phone:          varchar('phone', { length: 20 }),
  email:          varchar('email', { length: 255 }),
  village:        varchar('village', { length: 255 }).notNull().default(''),
  villageBn:      varchar('village_bn', { length: 255 }).notNull().default(''),
  post:           varchar('post', { length: 255 }).notNull().default(''),
  postBn:         varchar('post_bn', { length: 255 }).notNull().default(''),
  createdAt:      timestamp('created_at').defaultNow().notNull(),
  updatedAt:      timestamp('updated_at').defaultNow().notNull(),
});

export const artistSampleWorks = pgTable('artist_sample_works', {
  id:         uuid('id').primaryKey().defaultRandom(),
  artistId:   uuid('artist_id').notNull().references(() => artists.id, { onDelete: 'cascade' }),
  title:      varchar('title', { length: 255 }).notNull(),
  titleBn:    varchar('title_bn', { length: 255 }),
  type:       varchar('type', { length: 50 }).notNull(), // 'song' | 'video' | 'craft'
  mediaUrl:   text('media_url').notNull(),
  thumbnail:  text('thumbnail'),
  duration:   varchar('duration', { length: 20 }),
  createdAt:  timestamp('created_at').defaultNow().notNull(),
});

// ─── Archive ──────────────────────────────────────────────────────────────────

export const archiveItems = pgTable('archive_items', {
  id:           uuid('id').primaryKey().defaultRandom(),
  title:        varchar('title', { length: 255 }).notNull(),
  titleBn:      varchar('title_bn', { length: 255 }),
  description:  text('description'),
  descriptionBn: text('description_bn'),
  category:     archiveCategoryEnum('category').notNull(),
  subcategory:  varchar('subcategory', { length: 100 }),
  mediaType:    archiveMediaTypeEnum('media_type').notNull(),
  mediaUrl:     text('media_url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  tags:         jsonb('tags').$type<string[]>().default([]),
  artistId:     uuid('artist_id').references(() => artists.id, { onDelete: 'set null' }),
  year:         integer('year'),
  location:     varchar('location', { length: 255 }),
  isPublished:  boolean('is_published').default(true),
  createdAt:    timestamp('created_at').defaultNow().notNull(),
  updatedAt:    timestamp('updated_at').defaultNow().notNull(),
});

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const bookings = pgTable('bookings', {
  id:            uuid('id').primaryKey().defaultRandom(),
  artistId:      uuid('artist_id').notNull().references(() => artists.id, { onDelete: 'cascade' }),
  requesterName: varchar('requester_name', { length: 255 }).notNull(),
  phone:         varchar('phone', { length: 20 }).notNull(),
  email:         varchar('email', { length: 255 }),
  eventType:     varchar('event_type', { length: 100 }).notNull(),
  eventDate:     timestamp('event_date'),
  venue:         text('venue'),
  message:       text('message'),
  status:        bookingStatusEnum('status').default('pending').notNull(),
  createdAt:     timestamp('created_at').defaultNow().notNull(),
  updatedAt:     timestamp('updated_at').defaultNow().notNull(),
});

// ─── Relations ────────────────────────────────────────────────────────────────

export const artistsRelations = relations(artists, ({ many }) => ({
  sampleWorks:  many(artistSampleWorks),
  archiveItems: many(archiveItems),
  bookings:     many(bookings),
}));

export const artistSampleWorksRelations = relations(artistSampleWorks, ({ one }) => ({
  artist: one(artists, { fields: [artistSampleWorks.artistId], references: [artists.id] }),
}));

export const archiveItemsRelations = relations(archiveItems, ({ one }) => ({
  artist: one(artists, { fields: [archiveItems.artistId], references: [artists.id] }),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  artist: one(artists, { fields: [bookings.artistId], references: [artists.id] }),
}));

// ─── Type Exports (Drizzle inferred types) ────────────────────────────────────

export type Artist          = typeof artists.$inferSelect;
export type NewArtist       = typeof artists.$inferInsert;
export type ArtistSampleWork    = typeof artistSampleWorks.$inferSelect;
export type NewArtistSampleWork = typeof artistSampleWorks.$inferInsert;
export type ArchiveItem     = typeof archiveItems.$inferSelect;
export type NewArchiveItem  = typeof archiveItems.$inferInsert;
export type Booking         = typeof bookings.$inferSelect;
export type NewBooking      = typeof bookings.$inferInsert;
