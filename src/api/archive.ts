import { apiFetch } from './client';
import type { ArchiveItem } from '../data/archiveData';

function mapArchiveItem(a: Record<string, any>): ArchiveItem {
  return {
    id: a.id,
    title: a.title ?? '',
    description: a.description ?? '',
    mediaUrl: a.thumbnailUrl ?? a.mediaUrl ?? '',
    mediaType: 'image',
    // backend uses 'art_forms', frontend uses 'art-forms'
    category: a.category === 'art_forms' ? 'art-forms' : (a.category ?? ''),
    subcategory: a.subcategory ?? '',
    location: a.location ?? '',
    tags: a.tags ?? [],
  };
}

// Removed mapArtistToArchiveItem as it is no longer used for Digital Archives view


export async function getArchiveItems(query?: {
  search?: string;
  category?: string;
  subcategory?: string;
  location?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: ArchiveItem[]; meta: { total: number; totalPages: number } }> {
  const params = new URLSearchParams();
  if (query?.search) params.set('search', query.search);
  if (query?.page) params.set('page', String(query.page));
  if (query?.limit) params.set('limit', String(query.limit));

  // All categories use the archive endpoint in context of Digital Archives
  const cat = query?.category === 'art-forms' ? 'art_forms' : query?.category;
  if (cat) params.set('category', cat);
  if (query?.subcategory) params.set('subcategory', query.subcategory);
  if (query?.location) params.set('location', query.location);

  const qs = params.toString();
  const res = await apiFetch<{
    data: Record<string, any>[];
    meta: { total: number; totalPages: number };
  }>(`/archive${qs ? `?${qs}` : ''}`);
  return { data: res.data.map(mapArchiveItem), meta: res.meta };
}

export async function getArchiveFilters(category: string): Promise<{ locations: string[]; subcategories: string[] }> {
  // frontend uses 'art-forms', backend expects 'art_forms'
  const cat = category === 'art-forms' ? 'art_forms' : category;
  return apiFetch<{ locations: string[]; subcategories: string[] }>(`/archive/filters/${cat}`);
}
