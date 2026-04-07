import { apiFetch } from './client';
import type { Artist, SampleWork } from '../data/artistData';

function mapArtist(a: Record<string, any>): Artist {
  return {
    id: a.id,
    name: a.name,
    nameBN: a.nameBn ?? '',
    description: a.description ?? '',
    descriptionBN: a.descriptionBn ?? '',
    famousSong: a.famousSong ?? '',
    famousSongBN: a.famousSongBn ?? '',
    address: a.address ?? '',
    addressBN: a.addressBn ?? '',
    block: a.block ?? '',
    category: a.category ?? '',
    image: a.imageUrl ?? '',
    tags: a.tags ?? [],
    tagsBN: a.tagsBn ?? [],
    instruments: a.instruments ?? [],
    instrumentsBN: a.instrumentsBn ?? [],
    experience: a.experience ?? 0,
    availability: a.availability ?? true,
    phone: a.phone ?? '',
    email: a.email ?? '',
    sampleWorks: ((a.sampleWorks ?? []) as Record<string, any>[]).map(
      (w): SampleWork => ({
        id: w.id,
        title: w.title,
        titleBN: w.titleBn ?? '',
        type: w.type as 'song' | 'video' | 'craft',
        thumbnail: w.thumbnail ?? w.mediaUrl ?? '',
        mediaUrl: w.mediaUrl ?? undefined,
        duration: w.duration,
      }),
    ),
  };
}

export interface ArtistListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ArtistQuery {
  search?: string;
  category?: string;
  block?: string;
  availability?: boolean;
  page?: number;
  limit?: number;
}

export async function getArtists(
  query?: ArtistQuery,
): Promise<{ data: Artist[]; meta: ArtistListMeta }> {
  const params = new URLSearchParams();
  if (query?.search) params.set('search', query.search);
  if (query?.category) params.set('category', query.category);
  if (query?.block) params.set('block', query.block);
  if (query?.availability !== undefined)
    params.set('availability', String(query.availability));
  if (query?.page) params.set('page', String(query.page));
  if (query?.limit) params.set('limit', String(query.limit));

  const qs = params.toString();
  const res = await apiFetch<{ data: Record<string, any>[]; meta: ArtistListMeta }>(
    `/artists${qs ? `?${qs}` : ''}`,
  );
  return { data: res.data.map(mapArtist), meta: res.meta };
}

export async function getArtist(id: string): Promise<Artist> {
  const a = await apiFetch<Record<string, any>>(`/artists/${id}`);
  return mapArtist(a);
}

export async function updateArtist(id: string, patch: Record<string, any>): Promise<Artist> {
  const a = await apiFetch<Record<string, any>>(`/artists/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
  return mapArtist(a);
}

export interface SampleWorkPayload {
  title: string;
  titleBn?: string;
  type: 'song' | 'video' | 'craft';
  mediaUrl: string;
  thumbnail?: string;
  duration?: string;
}

export async function addSampleWork(artistId: string, payload: SampleWorkPayload) {
  return apiFetch<Record<string, any>>(`/artists/${artistId}/sample-works`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function deleteSampleWork(artistId: string, workId: string) {
  return apiFetch<{ message: string }>(`/artists/${artistId}/sample-works/${workId}`, {
    method: 'DELETE',
  });
}
