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
    tags: a.tags ?? [],
  };
}

export async function getArchiveItems(query?: {
  search?: string;
  category?: string;
  subcategory?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: ArchiveItem[]; meta: { total: number; totalPages: number } }> {
  const params = new URLSearchParams();
  if (query?.search) params.set('search', query.search);
  if (query?.category) {
    // frontend uses 'art-forms', backend expects 'art_forms'
    const cat = query.category === 'art-forms' ? 'art_forms' : query.category;
    params.set('category', cat);
  }
  if (query?.subcategory) params.set('subcategory', query.subcategory);
  if (query?.page) params.set('page', String(query.page));
  if (query?.limit) params.set('limit', String(query.limit));

  const qs = params.toString();
  const res = await apiFetch<{
    data: Record<string, any>[];
    meta: { total: number; totalPages: number };
  }>(`/archive${qs ? `?${qs}` : ''}`);
  return { data: res.data.map(mapArchiveItem), meta: res.meta };
}
