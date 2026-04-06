import { apiFetch } from './client';

export interface CreateBookingPayload {
  artistId: string;
  requesterName: string;
  phone: string;
  email?: string;
  eventType: string;
  eventDate?: string;
  venue?: string;
  message?: string;
}

export async function createBooking(
  payload: CreateBookingPayload,
): Promise<{ id: string; status: string }> {
  return apiFetch('/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
