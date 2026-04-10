import { apiFetch } from './client';
import type { ArchiveItem } from '../data/archiveData';
import {
  API_ARCHIVE_CATEGORY_BY_FRONTEND,
  FRONTEND_ARCHIVE_CATEGORY_BY_API,
} from '../../shared/domain';

function mapArchiveItem(a: Record<string, any>): ArchiveItem {
  return {
    id: a.id,
    title: a.title ?? '',
    description: a.description ?? '',
    mediaUrl: a.thumbnailUrl ?? a.mediaUrl ?? '',
    mediaType: 'image',
    // backend uses 'art_forms', frontend uses 'art-forms'
    category:
      FRONTEND_ARCHIVE_CATEGORY_BY_API[
        a.category as keyof typeof FRONTEND_ARCHIVE_CATEGORY_BY_API
      ] ?? (a.category ?? ''),
    subcategory: a.subcategory ?? '',
    tags: a.tags ?? [],
  };
}

// Map an artist record from /artists to the ArchiveItem shape
function mapArtistToArchiveItem(a: Record<string, any>): ArchiveItem {
  return {
    id: a.id,
    title: a.name ?? '',
    description: a.description ?? '',
    mediaUrl: a.imageUrl ?? '',
    mediaType: 'image',
    category: 'artists',
    subcategory: a.gramPanchayat ?? a.block ?? '',
    tags: Array.isArray(a.tags) ? a.tags : [],
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
  if (query?.page) params.set('page', String(query.page));
  if (query?.limit) params.set('limit', String(query.limit));

  // Artists category is served from the /artists endpoint (backed by the artists table)
  if (query?.category === 'artists') {
    if (query?.subcategory) params.set('block', query.subcategory);
    const qs = params.toString();
    const res = await apiFetch<{
      data: Record<string, any>[];
      meta: { total: number; totalPages: number };
    }>(`/artists${qs ? `?${qs}` : ''}`);
    return { data: res.data.map(mapArtistToArchiveItem), meta: res.meta };
  }

  // All other categories (artefacts, art-forms) use the archive endpoint
  if (query?.category) {
    // frontend uses 'art-forms', backend expects 'art_forms'
    params.set(
      'category',
      API_ARCHIVE_CATEGORY_BY_FRONTEND[query.category] ?? query.category,
    );
  }
  if (query?.subcategory) params.set('subcategory', query.subcategory);

  const qs = params.toString();
  const res = await apiFetch<{
    data: Record<string, any>[];
    meta: { total: number; totalPages: number };
  }>(`/archive${qs ? `?${qs}` : ''}`);
  return { data: res.data.map(mapArchiveItem), meta: res.meta };
}
