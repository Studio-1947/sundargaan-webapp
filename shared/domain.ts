export const ARTIST_CATEGORY_VALUES = [
  'baul',
  'folk_singer',
  'instrumentalist',
  'dancer',
  'storyteller',
  'craft_artisan',
] as const;

export type ArtistCategory = (typeof ARTIST_CATEGORY_VALUES)[number];

export const ARTIST_CATEGORY_LABELS: Record<
  ArtistCategory,
  { en: string; bn: string }
> = {
  baul: { en: 'Baul', bn: 'বাউল' },
  folk_singer: { en: 'Folk Singer', bn: 'লোকশিল্পী' },
  instrumentalist: { en: 'Instrumentalist', bn: 'বাদ্যশিল্পী' },
  dancer: { en: 'Dancer', bn: 'নৃত্যশিল্পী' },
  storyteller: { en: 'Storyteller', bn: 'গল্পকার' },
  craft_artisan: { en: 'Craft Artisan', bn: 'কারুশিল্পী' },
};

export const ARCHIVE_CATEGORY_VALUES = [
  'artists',
  'artefacts',
  'art_forms',
] as const;

export type ArchiveCategory = (typeof ARCHIVE_CATEGORY_VALUES)[number];

export const ARCHIVE_MEDIA_TYPE_VALUES = [
  'image',
  'audio',
  'video',
  'document',
] as const;

export type ArchiveMediaType = (typeof ARCHIVE_MEDIA_TYPE_VALUES)[number];

export const SAMPLE_WORK_TYPE_VALUES = ['song', 'video', 'craft'] as const;

export type SampleWorkType = (typeof SAMPLE_WORK_TYPE_VALUES)[number];

export const FRONTEND_ARCHIVE_CATEGORY_BY_API: Record<ArchiveCategory, string> = {
  artists: 'artists',
  artefacts: 'artefacts',
  art_forms: 'art-forms',
};

export const API_ARCHIVE_CATEGORY_BY_FRONTEND: Record<string, ArchiveCategory> = {
  artists: 'artists',
  artefacts: 'artefacts',
  'art-forms': 'art_forms',
};

export const LEGACY_ARTIST_CATEGORY_MAP: Record<string, ArtistCategory> = {
  baul: 'baul',
  bhatiali: 'folk_singer',
  jhumur: 'dancer',
  potter: 'craft_artisan',
  weaver: 'craft_artisan',
  storyteller: 'storyteller',
  folk_singer: 'folk_singer',
  instrumentalist: 'instrumentalist',
  dancer: 'dancer',
  craft_artisan: 'craft_artisan',
};
