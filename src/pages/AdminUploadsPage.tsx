import React, { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { uploadFile, listBlobs, deleteBlob, UploadType, BlobItem } from '../api/upload'
import {
  getArtists, updateArtist, addSampleWork, deleteSampleWork,
  SampleWorkPayload,
} from '../api/artists'
import type { Artist, SampleWork } from '../data/artistData'
import Logo from '../components/ui/Logo'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Toast { id: number; type: 'success' | 'error'; message: string }
let toastId = 0

// ─── Toast ────────────────────────────────────────────────────────────────────

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            onClick={() => onRemove(t.id)}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium max-w-sm cursor-pointer"
            style={{
              backgroundColor: t.type === 'success' ? '#1a1005' : '#fff',
              color: t.type === 'success' ? '#FEFCFB' : '#CB460C',
              border: t.type === 'error' ? '1.5px solid #CB460C' : 'none',
            }}
          >
            {t.type === 'success'
              ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#CB460C" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            }
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// ─── CopyButton ───────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <button onClick={copy} title="Copy URL"
      className="flex-shrink-0 p-1.5 rounded-md transition-colors"
      style={{ color: copied ? '#CB460C' : '#a89080', backgroundColor: copied ? '#F7EAE5' : 'transparent' }}
    >
      {copied
        ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="20 6 9 17 4 12"/></svg>
        : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
      }
    </button>
  )
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
function getFilename(pathname: string): string {
  return pathname.split('/').pop() ?? pathname
}

// ─── Category label map ───────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  baul: 'Baul',
  folk_singer: 'Folk Singer',
  instrumentalist: 'Instrumentalist',
  dancer: 'Dancer',
  storyteller: 'Storyteller',
  craft_artisan: 'Craft Artisan',
}

const CATEGORIES = Object.entries(CATEGORY_LABELS)

// ─── ─── ─── ARTISTS PANEL ─── ─── ─── ─────────────────────────────────────

// Avatar placeholder
function ArtistAvatar({ artist }: { artist: Artist }) {
  if (artist.image) {
    return <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
  }
  return (
    <div className="w-full h-full flex items-center justify-center text-2xl font-bold"
      style={{ backgroundColor: '#F7EAE5', color: '#CB460C' }}>
      {artist.name.charAt(0)}
    </div>
  )
}

// ─── Artist editor drawer ─────────────────────────────────────────────────────

interface ArtistEditorProps {
  artist: Artist
  onClose: () => void
  onUpdated: (updated: Artist) => void
  addToast: (type: Toast['type'], msg: string) => void
}

function ArtistEditor({ artist, onClose, onUpdated, addToast }: ArtistEditorProps) {
  // ── basic fields ──
  const [fields, setFields] = useState({
    name: artist.name,
    nameBn: artist.nameBN,
    category: artist.category,
    block: artist.block,
    address: artist.address,
    addressBn: artist.addressBN,
    description: artist.description,
    descriptionBn: artist.descriptionBN,
    famousSong: artist.famousSong,
    famousSongBn: artist.famousSongBN,
    phone: artist.phone,
    email: artist.email,
    experience: String(artist.experience ?? 0),
    availability: artist.availability,
    village: artist.village ?? '',
    villageBn: artist.villageBN ?? '',
    post: artist.post ?? '',
    postBn: artist.postBN ?? '',
    instruments: (artist.instruments ?? []).join(', '),
    tags: (artist.tags ?? []).join(', '),
  })
  const [savingFields, setSavingFields] = useState(false)

  // ── photo upload ──
  const [photoUploading, setPhotoUploading] = useState(false)
  const [currentPhoto, setCurrentPhoto] = useState(artist.image ?? '')
  const photoInputRef = useRef<HTMLInputElement>(null)

  // ── sample works ──
  const [works, setWorks] = useState<SampleWork[]>(artist.sampleWorks ?? [])
  const [addingWork, setAddingWork] = useState(false)
  const [newWork, setNewWork] = useState<{
    title: string; titleBn: string; type: 'song' | 'video' | 'craft';
    mediaUrl: string; thumbnail: string; duration: string;
  }>({ title: '', titleBn: '', type: 'song', mediaUrl: '', thumbnail: '', duration: '' })
  const [mediaUploading, setMediaUploading] = useState(false)
  const [thumbnailUploading, setThumbnailUploading] = useState(false)
  const mediaInputRef = useRef<HTMLInputElement>(null)
  const thumbInputRef = useRef<HTMLInputElement>(null)
  const [deletingWorkId, setDeletingWorkId] = useState<string | null>(null)

  // ── save basic fields ──
  const handleSaveFields = async () => {
    setSavingFields(true)
    try {
      const patch = {
        name: fields.name,
        nameBn: fields.nameBn,
        category: fields.category,
        block: fields.block,
        address: fields.address,
        addressBn: fields.addressBn,
        description: fields.description,
        descriptionBn: fields.descriptionBn,
        famousSong: fields.famousSong || undefined,
        famousSongBn: fields.famousSongBn || undefined,
        phone: fields.phone || undefined,
        email: fields.email || undefined,
        experience: parseInt(fields.experience) || 0,
        availability: fields.availability,
        village: fields.village || undefined,
        villageBn: fields.villageBn || undefined,
        post: fields.post || undefined,
        postBn: fields.postBn || undefined,
        instruments: fields.instruments ? fields.instruments.split(',').map((s) => s.trim()).filter(Boolean) : [],
        tags: fields.tags ? fields.tags.split(',').map((s) => s.trim()).filter(Boolean) : [],
      }
      const updated = await updateArtist(artist.id, patch)
      onUpdated(updated)
      addToast('success', 'Artist details saved')
    } catch (e: any) {
      addToast('error', e.message ?? 'Save failed')
    } finally {
      setSavingFields(false)
    }
  }

  // ── upload photo ──
  const handlePhotoUpload = async (file: File) => {
    setPhotoUploading(true)
    try {
      const result = await uploadFile(file, 'image', 'cloudinary')
      const updated = await updateArtist(artist.id, { imageUrl: result.url })
      setCurrentPhoto(result.url)
      onUpdated(updated)
      addToast('success', 'Profile photo updated')
    } catch (e: any) {
      addToast('error', e.message ?? 'Photo upload failed')
    } finally {
      setPhotoUploading(false)
    }
  }

  // ── upload media for new work ──
  const handleMediaUpload = async (file: File) => {
    const type = newWork.type === 'video' ? 'video' : 'audio'
    setMediaUploading(true)
    try {
      const result = await uploadFile(file, type, 'cloudinary')
      setNewWork((w) => ({ ...w, mediaUrl: result.url }))
      addToast('success', 'Media uploaded')
    } catch (e: any) {
      addToast('error', e.message ?? 'Upload failed')
    } finally {
      setMediaUploading(false)
    }
  }

  // ── upload thumbnail for new work ──
  const handleThumbnailUpload = async (file: File) => {
    setThumbnailUploading(true)
    try {
      const result = await uploadFile(file, 'image', 'cloudinary')
      setNewWork((w) => ({ ...w, thumbnail: result.url }))
      addToast('success', 'Thumbnail uploaded')
    } catch (e: any) {
      addToast('error', e.message ?? 'Upload failed')
    } finally {
      setThumbnailUploading(false)
    }
  }

  // ── add sample work ──
  const handleAddWork = async () => {
    if (!newWork.title || !newWork.mediaUrl) {
      addToast('error', 'Title and media URL are required')
      return
    }
    setAddingWork(true)
    try {
      const payload: SampleWorkPayload = {
        title: newWork.title,
        titleBn: newWork.titleBn || undefined,
        type: newWork.type,
        mediaUrl: newWork.mediaUrl,
        thumbnail: newWork.thumbnail || undefined,
        duration: newWork.duration || undefined,
      }
      const work = await addSampleWork(artist.id, payload)
      setWorks((prev) => [...prev, {
        id: work.id, title: work.title, titleBN: work.titleBn ?? '',
        type: work.type, thumbnail: work.thumbnail ?? work.mediaUrl ?? '',
        duration: work.duration,
      }])
      setNewWork({ title: '', titleBn: '', type: 'song', mediaUrl: '', thumbnail: '', duration: '' })
      addToast('success', 'Sample work added')
    } catch (e: any) {
      addToast('error', e.message ?? 'Failed to add work')
    } finally {
      setAddingWork(false)
    }
  }

  // ── delete sample work ──
  const handleDeleteWork = async (workId: string) => {
    setDeletingWorkId(workId)
    try {
      await deleteSampleWork(artist.id, workId)
      setWorks((prev) => prev.filter((w) => w.id !== workId))
      addToast('success', 'Sample work removed')
    } catch (e: any) {
      addToast('error', e.message ?? 'Delete failed')
    } finally {
      setDeletingWorkId(null)
    }
  }

  const Field = ({ label, value, onChange, textarea = false, type = 'text' }: {
    label: string; value: string; onChange: (v: string) => void; textarea?: boolean; type?: string
  }) => (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#a89080' }}>{label}</label>
      {textarea
        ? <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border outline-none resize-none transition-colors"
            style={{ borderColor: '#e5d5cd', backgroundColor: '#FEFCFB', color: '#1a1005' }}
            onFocus={(e) => e.target.style.borderColor = '#CB460C'}
            onBlur={(e) => e.target.style.borderColor = '#e5d5cd'} />
        : <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border outline-none transition-colors"
            style={{ borderColor: '#e5d5cd', backgroundColor: '#FEFCFB', color: '#1a1005' }}
            onFocus={(e) => e.target.style.borderColor = '#CB460C'}
            onBlur={(e) => e.target.style.borderColor = '#e5d5cd'} />
      }
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.22 }}
      className="h-full flex flex-col overflow-hidden"
      style={{ backgroundColor: '#FEFCFB' }}
    >
      {/* Drawer header */}
      <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: '#e5d5cd' }}>
        <button onClick={onClose} className="p-1.5 rounded-lg transition-colors"
          style={{ color: '#a89080' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F7EAE5'; e.currentTarget.style.color = '#CB460C' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#a89080' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border" style={{ borderColor: '#e5d5cd' }}>
          {currentPhoto
            ? <img src={currentPhoto} alt={artist.name} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center font-bold text-sm"
                style={{ backgroundColor: '#F7EAE5', color: '#CB460C' }}>{artist.name.charAt(0)}</div>
          }
        </div>
        <div className="min-w-0">
          <h2 className="font-semibold text-base truncate" style={{ color: '#1a1005' }}>{artist.name}</h2>
          <p className="text-xs" style={{ color: '#a89080' }}>{CATEGORY_LABELS[artist.category] ?? artist.category}</p>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">

        {/* ── Photo ── */}
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.18em] mb-3" style={{ color: '#a89080' }}>Profile Photo</p>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden border flex-shrink-0" style={{ borderColor: '#e5d5cd' }}>
              {currentPhoto
                ? <img src={currentPhoto} alt={artist.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-2xl font-bold"
                    style={{ backgroundColor: '#F7EAE5', color: '#CB460C' }}>{artist.name.charAt(0)}</div>
              }
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste URL →"
                  className="flex-1 px-3 py-2 text-sm rounded-lg border outline-none transition-colors"
                  style={{ borderColor: '#e5d5cd', backgroundColor: '#FEFCFB', color: '#1a1005' }}
                  onFocus={(e) => e.target.style.borderColor = '#CB460C'}
                  onBlur={(e) => e.target.style.borderColor = '#e5d5cd'}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter') {
                      const url = e.currentTarget.value.trim();
                      if (url) {
                        setPhotoUploading(true);
                        try {
                          const updated = await updateArtist(artist.id, { imageUrl: url });
                          setCurrentPhoto(url);
                          onUpdated(updated);
                          addToast('success', 'Profile photo URL updated');
                        } catch (err: any) {
                          addToast('error', err.message ?? 'Update failed');
                        } finally {
                          setPhotoUploading(false);
                        }
                      }
                    }
                  }}
                />
                <input ref={photoInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" title="Upload Artist Photo"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f); e.target.value = '' }} />
                <button
                  onClick={() => photoInputRef.current?.click()}
                  disabled={photoUploading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ backgroundColor: '#F7EAE5', color: '#CB460C' }}
                  onMouseEnter={(e) => { if (!photoUploading) e.currentTarget.style.backgroundColor = '#F1D8CD' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F7EAE5' }}
                >
                  {photoUploading
                    ? <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
                      </motion.span></>
                    : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></>
                  }
                  Upload
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Basic Info ── */}
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.18em] mb-3" style={{ color: '#a89080' }}>Basic Info</p>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Name (English)" value={fields.name} onChange={(v) => setFields((f) => ({ ...f, name: v }))} />
              <Field label="Name (Bengali)" value={fields.nameBn} onChange={(v) => setFields((f) => ({ ...f, nameBn: v }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#a89080' }}>Category</label>
                <select value={fields.category} onChange={(e) => setFields((f) => ({ ...f, category: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border outline-none transition-colors"
                  style={{ borderColor: '#e5d5cd', backgroundColor: '#FEFCFB', color: '#1a1005' }}>
                  {CATEGORIES.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
                </select>
              </div>
              <Field label="Block" value={fields.block} onChange={(v) => setFields((f) => ({ ...f, block: v }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Village (English)" value={fields.village} onChange={(v) => setFields((f) => ({ ...f, village: v }))} />
              <Field label="Village (Bengali)" value={fields.villageBn} onChange={(v) => setFields((f) => ({ ...f, villageBn: v }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Post Office (English)" value={fields.post} onChange={(v) => setFields((f) => ({ ...f, post: v }))} />
              <Field label="Post Office (Bengali)" value={fields.postBn} onChange={(v) => setFields((f) => ({ ...f, postBn: v }))} />
            </div>
            <Field label="Address (English)" value={fields.address} onChange={(v) => setFields((f) => ({ ...f, address: v }))} />
            <Field label="Address (Bengali)" value={fields.addressBn} onChange={(v) => setFields((f) => ({ ...f, addressBn: v }))} />
            <Field label="Description (English)" value={fields.description} onChange={(v) => setFields((f) => ({ ...f, description: v }))} textarea />
            <Field label="Description (Bengali)" value={fields.descriptionBn} onChange={(v) => setFields((f) => ({ ...f, descriptionBn: v }))} textarea />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Famous Song (English)" value={fields.famousSong} onChange={(v) => setFields((f) => ({ ...f, famousSong: v }))} />
              <Field label="Famous Song (Bengali)" value={fields.famousSongBn} onChange={(v) => setFields((f) => ({ ...f, famousSongBn: v }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Phone" value={fields.phone} onChange={(v) => setFields((f) => ({ ...f, phone: v }))} />
              <Field label="Experience (years)" value={fields.experience} onChange={(v) => setFields((f) => ({ ...f, experience: v }))} type="number" />
            </div>
            <Field label="Instruments (comma separated)" value={fields.instruments} onChange={(v) => setFields((f) => ({ ...f, instruments: v }))} />
            <Field label="Tags (comma separated)" value={fields.tags} onChange={(v) => setFields((f) => ({ ...f, tags: v }))} />
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#a89080' }}>Available for Booking</label>
              <button
                onClick={() => setFields((f) => ({ ...f, availability: !f.availability }))}
                className="relative w-10 h-5 rounded-full transition-colors"
                style={{ backgroundColor: fields.availability ? '#CB460C' : '#e5d5cd' }}
              >
                <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                  style={{ transform: fields.availability ? 'translateX(22px)' : 'translateX(2px)' }} />
              </button>
              <span className="text-xs" style={{ color: fields.availability ? '#CB460C' : '#a89080' }}>
                {fields.availability ? 'Available' : 'Unavailable'}
              </span>
            </div>
          </div>

          <button
            onClick={handleSaveFields}
            disabled={savingFields}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{ backgroundColor: savingFields ? '#e5d5cd' : '#CB460C', color: '#fff' }}
          >
            {savingFields
              ? <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
                </motion.span> Saving…</>
              : 'Save Details'
            }
          </button>
        </section>

        {/* ── Sample Works ── */}
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.18em] mb-3" style={{ color: '#a89080' }}>
            Sample Works ({works.length})
          </p>

          {/* Existing works */}
          {works.length > 0 && (
            <div className="space-y-2 mb-4">
              {works.map((w) => (
                <div key={w.id}
                  className="flex items-center gap-3 p-3 rounded-xl border"
                  style={{ borderColor: '#e5d5cd', backgroundColor: '#F7EAE5' }}>
                  <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: '#e5d5cd' }}>
                    {w.thumbnail
                      ? <img src={w.thumbnail} alt="" className="w-full h-full object-cover" />
                      : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a89080" strokeWidth="2">
                          {w.type === 'video'
                            ? <path d="m15 10 4.553-2.276A1 1 0 0 1 21 8.723v6.554a1 1 0 0 1-1.447.894L15 14M2 6h13v12H2z"/>
                            : <path d="M9 18V5l12-2v13M6 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>}
                        </svg>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: '#1a1005' }}>{w.title}</p>
                    <p className="text-xs" style={{ color: '#a89080' }}>
                      {w.type}{w.duration ? ` · ${w.duration}` : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteWork(w.id)}
                    disabled={deletingWorkId === w.id}
                    className="p-1.5 rounded-lg transition-colors flex-shrink-0"
                    style={{ color: '#a89080' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fce8e8'; e.currentTarget.style.color = '#e53e3e' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#a89080' }}
                  >
                    {deletingWorkId === w.id
                      ? <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/></svg>
                        </motion.span>
                      : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="m19 6-.867 14.142A2 2 0 0 1 16.138 22H7.862a2 2 0 0 1-1.995-1.858L5 6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    }
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add new work form */}
          <div className="rounded-xl border p-4 space-y-3" style={{ borderColor: '#e5d5cd' }}>
            <p className="text-xs font-semibold" style={{ color: '#1a1005' }}>Add New Work</p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#a89080' }}>Title (English)</label>
                <input value={newWork.title} onChange={(e) => setNewWork((w) => ({ ...w, title: e.target.value }))}
                  placeholder="Song or video title"
                  className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                  style={{ borderColor: '#e5d5cd', backgroundColor: '#FEFCFB', color: '#1a1005' }} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#a89080' }}>Title (Bengali)</label>
                <input value={newWork.titleBn} onChange={(e) => setNewWork((w) => ({ ...w, titleBn: e.target.value }))}
                  placeholder="বাংলা শিরোনাম"
                  className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                  style={{ borderColor: '#e5d5cd', backgroundColor: '#FEFCFB', color: '#1a1005' }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#a89080' }}>Type</label>
                <select value={newWork.type} onChange={(e) => setNewWork((w) => ({ ...w, type: e.target.value as any }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                  style={{ borderColor: '#e5d5cd', backgroundColor: '#FEFCFB', color: '#1a1005' }}>
                  <option value="song">Song (Audio)</option>
                  <option value="video">Video</option>
                  <option value="craft">Craft / Photo</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#a89080' }}>Duration (optional)</label>
                <input value={newWork.duration} onChange={(e) => setNewWork((w) => ({ ...w, duration: e.target.value }))}
                  placeholder="e.g. 4:32"
                  className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                  style={{ borderColor: '#e5d5cd', backgroundColor: '#FEFCFB', color: '#1a1005' }} />
              </div>
            </div>

            {/* Media upload */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#a89080' }}>
                {newWork.type === 'video' ? 'Video File' : newWork.type === 'song' ? 'Audio File' : 'Image File'}
              </label>
              <input ref={mediaInputRef} type="file"
                accept={newWork.type === 'video' ? 'video/*' : newWork.type === 'song' ? 'audio/*' : 'image/*'}
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleMediaUpload(f); e.target.value = '' }} />
              <div className="flex gap-2">
                <input value={newWork.mediaUrl} onChange={(e) => setNewWork((w) => ({ ...w, mediaUrl: e.target.value }))}
                  placeholder="Paste URL or upload →"
                  className="flex-1 px-3 py-2 text-sm rounded-lg border outline-none"
                  style={{ borderColor: '#e5d5cd', backgroundColor: '#FEFCFB', color: '#1a1005' }} />
                <button onClick={() => mediaInputRef.current?.click()} disabled={mediaUploading}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium flex-shrink-0 transition-colors"
                  style={{ backgroundColor: '#F7EAE5', color: '#CB460C' }}>
                  {mediaUploading
                    ? <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/></svg>
                      </motion.span>
                    : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  }
                  Upload
                </button>
              </div>
            </div>

            {/* Thumbnail upload */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#a89080' }}>Thumbnail (optional)</label>
              <input ref={thumbInputRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleThumbnailUpload(f); e.target.value = '' }} />
              <div className="flex gap-2">
                <input value={newWork.thumbnail} onChange={(e) => setNewWork((w) => ({ ...w, thumbnail: e.target.value }))}
                  placeholder="Thumbnail URL or upload →"
                  className="flex-1 px-3 py-2 text-sm rounded-lg border outline-none"
                  style={{ borderColor: '#e5d5cd', backgroundColor: '#FEFCFB', color: '#1a1005' }} />
                <button onClick={() => thumbInputRef.current?.click()} disabled={thumbnailUploading}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium flex-shrink-0 transition-colors"
                  style={{ backgroundColor: '#F7EAE5', color: '#CB460C' }}>
                  {thumbnailUploading
                    ? <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/></svg>
                      </motion.span>
                    : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  }
                  Upload
                </button>
              </div>
            </div>

            <button onClick={handleAddWork} disabled={addingWork || !newWork.title || !newWork.mediaUrl}
              className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors"
              style={{
                backgroundColor: (!newWork.title || !newWork.mediaUrl || addingWork) ? '#e5d5cd' : '#CB460C',
                color: '#fff',
              }}>
              {addingWork ? 'Adding…' : '+ Add Sample Work'}
            </button>
          </div>
        </section>
      </div>
    </motion.div>
  )
}

// ─── Artists panel (list) ─────────────────────────────────────────────────────

function ArtistsPanel({ addToast }: { addToast: (type: Toast['type'], msg: string) => void }) {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [selected, setSelected] = useState<Artist | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getArtists({ limit: 100 })
      setArtists(res.data)
    } catch (e: any) {
      addToast('error', e.message ?? 'Failed to load artists')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => { load() }, [load])

  const filtered = artists.filter((a) => {
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.block.toLowerCase().includes(search.toLowerCase())
    const matchCat = !categoryFilter || a.category === categoryFilter
    return matchSearch && matchCat
  })

  const handleUpdated = (updated: Artist) => {
    setArtists((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
    setSelected(updated)
  }

  return (
    <div className="flex h-full min-h-0">
      {/* Artist list */}
      <div className="flex flex-col min-w-0" style={{ width: selected ? '340px' : '100%', flexShrink: 0 }}>
        {/* Filters */}
        <div className="px-8 py-4 border-b flex items-center gap-3 flex-wrap" style={{ borderColor: '#e5d5cd' }}>
          <div className="relative flex-1 min-w-48">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a89080" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search artists…"
              className="w-full pl-8 pr-3 py-2 text-sm rounded-full border outline-none"
              style={{ borderColor: '#e5d5cd', backgroundColor: '#FEFCFB', color: '#1a1005' }} />
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-full border outline-none"
            style={{ borderColor: '#e5d5cd', backgroundColor: '#FEFCFB', color: '#1a1005' }}>
            <option value="">All categories</option>
            {CATEGORIES.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
          </select>
          <button onClick={load} disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-colors"
            style={{ backgroundColor: '#F7EAE5', color: '#CB460C' }}>
            <motion.span animate={loading ? { rotate: 360 } : { rotate: 0 }}
              transition={{ repeat: loading ? Infinity : 0, duration: 1, ease: 'linear' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                <path d="M21 3v5h-5"/>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                <path d="M8 16H3v5"/>
              </svg>
            </motion.span>
            Refresh
          </button>
        </div>

        {/* Count */}
        <div className="px-8 py-2 border-b" style={{ borderColor: '#e5d5cd' }}>
          <p className="text-xs" style={{ color: '#a89080' }}>
            {filtered.length} of {artists.length} artists
            {filtered.some((a) => !a.image) && (
              <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold"
                style={{ backgroundColor: '#FFF4F0', color: '#CB460C' }}>
                {filtered.filter((a) => !a.image).length} missing photos
              </span>
            )}
          </p>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-8 h-8 rounded-full border-2 border-t-transparent"
                style={{ borderColor: '#CB460C', borderTopColor: 'transparent' }} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <p className="text-sm" style={{ color: '#a89080' }}>No artists found</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: '#e5d5cd' }}>
              {filtered.map((artist) => (
                <button key={artist.id}
                  onClick={() => setSelected(selected?.id === artist.id ? null : artist)}
                  className="w-full flex items-center gap-4 px-8 py-4 text-left transition-colors"
                  style={{ backgroundColor: selected?.id === artist.id ? '#F7EAE5' : 'transparent' }}
                  onMouseEnter={(e) => { if (selected?.id !== artist.id) e.currentTarget.style.backgroundColor = '#FFFAF8' }}
                  onMouseLeave={(e) => { if (selected?.id !== artist.id) e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border"
                    style={{ borderColor: artist.image ? '#e5d5cd' : '#f4c4b0' }}>
                    <ArtistAvatar artist={artist} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate" style={{ color: '#1a1005' }}>{artist.name}</p>
                      {!artist.image && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-bold flex-shrink-0"
                          style={{ backgroundColor: '#FFF4F0', color: '#CB460C' }}>No photo</span>
                      )}
                    </div>
                    <p className="text-xs truncate mt-0.5" style={{ color: '#a89080' }}>
                      {CATEGORY_LABELS[artist.category] ?? artist.category} · {artist.block}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: '#c0a090' }}>
                      {artist.sampleWorks?.length ?? 0} work{(artist.sampleWorks?.length ?? 0) !== 1 ? 's' : ''}
                      {' · '}
                      <span style={{ color: artist.availability ? '#22863a' : '#CB460C' }}>
                        {artist.availability ? 'Available' : 'Unavailable'}
                      </span>
                    </p>
                  </div>

                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke={selected?.id === artist.id ? '#CB460C' : '#e5d5cd'} strokeWidth="2">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '480px', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="flex-shrink-0 border-l overflow-hidden"
            style={{ borderColor: '#e5d5cd' }}
          >
            <ArtistEditor
              key={selected.id}
              artist={selected}
              onClose={() => setSelected(null)}
              onUpdated={handleUpdated}
              addToast={addToast}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── ─── ─── UPLOADS PANEL ─── ─── ─── ──────────────────────────────────────

interface UploadTab {
  id: UploadType; label: string; prefix: string; accept: string; icon: React.ReactNode; maxSizeMb: number
}

const UPLOAD_TABS: UploadTab[] = [
  { id: 'image', label: 'Images', prefix: 'images/', accept: 'image/jpeg,image/png,image/webp,image/gif', maxSizeMb: 10,
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg> },
  { id: 'audio', label: 'Audio', prefix: 'audios/', accept: 'audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/flac,audio/aac', maxSizeMb: 50,
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg> },
  { id: 'video', label: 'Videos', prefix: 'videos/', accept: 'video/mp4,video/webm,video/ogg,video/quicktime', maxSizeMb: 200,
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m15 10 4.553-2.276A1 1 0 0 1 21 8.723v6.554a1 1 0 0 1-1.447.894L15 14"/><rect x="2" y="6" width="13" height="12" rx="2"/></svg> },
  { id: 'document', label: 'Documents', prefix: 'documents/', accept: 'application/pdf,text/plain', maxSizeMb: 20,
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg> },
]

type ProviderType = 'vercel' | 'cloudinary'

function ProviderBadge({ provider }: { provider: ProviderType }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
      style={{ backgroundColor: provider === 'vercel' ? '#F7EAE5' : '#EEF0FB', color: provider === 'vercel' ? '#CB460C' : '#3448c5' }}>
      {provider === 'vercel' ? '▲ Vercel' : '☁ Cloudinary'}
    </span>
  )
}

function BlobCard({
  blob,
  type,
  onDelete,
  selected,
  onSelect,
}: {
  blob: BlobItem;
  type: UploadType;
  onDelete: (url: string) => void;
  selected: boolean;
  onSelect: (url: string, multi: boolean) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
      onClick={(e) => {
        // Only select if not clicking the delete confirmation buttons
        if (!(e.target as HTMLElement).closest('button')) {
          onSelect(blob.url, e.shiftKey);
        }
      }}
      className="relative rounded-xl border overflow-hidden transition-all group cursor-pointer"
      style={{
        borderColor: selected ? '#CB460C' : '#e5d5cd',
        backgroundColor: '#FEFCFB',
        boxShadow: selected ? '0 0 0 1px #CB460C, 0 4px 12px rgba(203,70,12,0.1)' : 'none',
      }}>
      {/* Checkbox Overlay */}
      <div className={`absolute top-3 left-3 z-10 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${selected ? 'bg-[#CB460C] border-[#CB460C]' : 'bg-white/80 border-[#e5d5cd] opacity-0 group-hover:opacity-100 backdrop-blur-sm'}`}>
        {selected && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>}
      </div>

      {type === 'image' && <div className="h-40 overflow-hidden" style={{ backgroundColor: '#F7EAE5' }}>
        <img src={blob.url} alt={getFilename(blob.pathname)} className="w-full h-full object-cover" loading="lazy" />
      </div>}
      {type === 'audio' && <div className="px-4 pt-4"><audio controls className="w-full h-9" src={blob.url} /></div>}
      {type === 'video' && <div className="h-40 overflow-hidden bg-black">
        <video src={blob.url} className="w-full h-full object-contain" muted />
      </div>}
      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium truncate flex-1" style={{ color: '#1a1005' }} title={getFilename(blob.pathname)}>
            {getFilename(blob.pathname)}
          </p>
          <ProviderBadge provider={blob.provider} />
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: '#a89080' }}>
          <span>{formatBytes(blob.size)}</span><span>·</span><span>{formatDate(blob.uploadedAt)}</span>
        </div>
        <div className="flex items-center gap-1 rounded-lg px-2 py-1.5" style={{ backgroundColor: '#F7EAE5' }}>
          <a href={blob.url} target="_blank" rel="noopener noreferrer"
            className="flex-1 text-xs truncate hover:underline" style={{ color: '#CB460C' }}>{blob.url}</a>
          <CopyButton text={blob.url} />
        </div>
        <div className="flex justify-end pt-1">
          {confirmDelete
            ? <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: '#a89080' }}>Sure?</span>
                <button className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ backgroundColor: '#CB460C', color: '#fff' }} onClick={() => onDelete(blob.url)}>Delete</button>
                <button className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ backgroundColor: '#F7EAE5', color: '#4a3b33' }} onClick={() => setConfirmDelete(false)}>Cancel</button>
              </div>
            : <button className="text-xs px-3 py-1 rounded-full font-medium transition-colors"
                style={{ backgroundColor: '#F7EAE5', color: '#6b5b4f' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F1D8CD'; e.currentTarget.style.color = '#CB460C' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F7EAE5'; e.currentTarget.style.color = '#6b5b4f' }}
                onClick={() => setConfirmDelete(true)}>Delete</button>
          }
        </div>
      </div>
    </motion.div>
  )
}

function UploadsPanel({ addToast }: { addToast: (type: Toast['type'], msg: string) => void }) {
  const [activeTab, setActiveTab] = useState<UploadType>('image')
  const [provider, setProvider] = useState<ProviderType>('cloudinary')
  const [blobs, setBlobs] = useState<Record<string, BlobItem[]>>({})
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set())
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const tab = UPLOAD_TABS.find((t) => t.id === activeTab)!
  const cacheKey = `${provider}:${activeTab}`

  const loadBlobs = useCallback(async (p: ProviderType, t: UploadType) => {
    setLoading(true)
    try {
      const prefix = p === 'vercel' ? UPLOAD_TABS.find((tb) => tb.id === t)!.prefix : undefined
      const items = await listBlobs(p, t, prefix)
      setBlobs((prev) => ({ ...prev, [`${p}:${t}`]: items }))
    } catch (e: any) {
      addToast('error', e.message ?? 'Failed to load files')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    setSelectedUrls(new Set())
    loadBlobs(provider, activeTab)
  }, [provider, activeTab, loadBlobs])

  const handleUpload = async (files: File[]) => {
    setUploading(true)
    let ok = 0
    for (const file of files) {
      try {
        const result = await uploadFile(file, activeTab, provider)
        setBlobs((prev) => ({
          ...prev,
          [cacheKey]: [{ url: result.url, pathname: result.pathname, size: result.size, uploadedAt: new Date().toISOString(), provider: result.provider }, ...(prev[cacheKey] ?? [])],
        }))
        ok++
      } catch (e: any) { addToast('error', `${file.name}: ${e.message}`) }
    }
    setUploading(false)
    if (ok > 0) addToast('success', `${ok} file${ok > 1 ? 's' : ''} uploaded`)
  }

  const handleDelete = async (url: string) => {
    try {
      await deleteBlob(url, provider)
      setBlobs((prev) => ({ ...prev, [cacheKey]: (prev[cacheKey] ?? []).filter((b) => b.url !== url) }))
      setSelectedUrls((prev) => {
        const next = new Set(prev)
        next.delete(url)
        return next
      })
      addToast('success', 'File deleted')
    } catch (e: any) { addToast('error', e.message ?? 'Delete failed') }
  }

  const handleBulkDelete = async () => {
    const urls = Array.from(selectedUrls)
    if (urls.length === 0) return
    if (!window.confirm(`Are you sure you want to delete ${urls.length} files?`)) return

    setBulkDeleting(true)
    let ok = 0
    let fail = 0
    for (const url of urls) {
      try {
        await deleteBlob(url, provider)
        ok++
      } catch (e) { fail++ }
    }
    setBulkDeleting(false)

    if (ok > 0) {
      setBlobs((prev) => ({
        ...prev,
        [cacheKey]: (prev[cacheKey] ?? []).filter((b) => !selectedUrls.has(b.url)),
      }))
      setSelectedUrls(new Set())
      addToast('success', `Successfully deleted ${ok} file${ok > 1 ? 's' : ''}`)
    }
    if (fail > 0) {
      addToast('error', `Failed to delete ${fail} file${fail > 1 ? 's' : ''}`)
    }
  }

  const toggleSelect = (url: string) => {
    setSelectedUrls((prev) => {
      const next = new Set(prev)
      if (next.has(url)) next.delete(url)
      else next.add(url)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedUrls.size === currentBlobs.length) {
      setSelectedUrls(new Set())
    } else {
      setSelectedUrls(new Set(currentBlobs.map((b) => b.url)))
    }
  }

  const currentBlobs = blobs[cacheKey] ?? []

  return (
    <div className="flex h-full min-h-0">
      {/* Sub-tabs */}
      <div className="w-48 flex-shrink-0 border-r flex flex-col" style={{ borderColor: '#e5d5cd' }}>
        <div className="p-3 space-y-1">
          {UPLOAD_TABS.map((t) => {
            const isActive = t.id === activeTab
            const count = (blobs[`${provider}:${t.id}`] ?? []).length
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left"
                style={{ backgroundColor: isActive ? '#F7EAE5' : 'transparent', color: isActive ? '#CB460C' : '#4a3b33' }}>
                <span style={{ color: isActive ? '#CB460C' : '#a89080' }}>{t.icon}</span>
                {t.label}
                {count > 0 && <span className="ml-auto text-xs font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: isActive ? '#CB460C' : '#e5d5cd', color: isActive ? '#fff' : '#6b5b4f' }}>{count}</span>}
              </button>
            )
          })}
        </div>
        {/* Provider toggle */}
        <div className="mt-auto p-3 border-t space-y-1" style={{ borderColor: '#e5d5cd' }}>
          <p className="text-[10px] font-bold uppercase tracking-wider px-1 mb-2" style={{ color: '#a89080' }}>Storage</p>
          {(['vercel', 'cloudinary'] as ProviderType[]).map((p) => (
            <button key={p} onClick={() => setProvider(p)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all"
              style={{ backgroundColor: provider === p ? '#F7EAE5' : 'transparent', color: provider === p ? '#CB460C' : '#6b5b4f' }}>
              <span>{p === 'vercel' ? '▲' : '☁'}</span>
              {p === 'vercel' ? 'Vercel Blob' : 'Cloudinary'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-6 py-4 border-b flex items-center justify-between gap-3" style={{ borderColor: '#e5d5cd' }}>
          <div>
            <h2 className="text-base font-semibold" style={{ color: '#1a1005' }}>{tab.label}</h2>
            <p className="text-xs" style={{ color: '#a89080' }}>{currentBlobs.length} files · {provider === 'vercel' ? 'Vercel Blob' : 'Cloudinary'}</p>
          </div>
          <div className="flex items-center gap-2">
            {selectedUrls.size > 0 && (
              <div className="flex items-center gap-2 mr-4 pr-4 border-r" style={{ borderColor: '#e5d5cd' }}>
                <span className="text-xs font-bold" style={{ color: '#CB460C' }}>{selectedUrls.size} Selected</span>
                <button onClick={toggleSelectAll} className="text-xs px-3 py-1.5 rounded-lg border transition-colors"
                  style={{ borderColor: '#CB460C', color: '#CB460C' }}>
                  {selectedUrls.size === currentBlobs.length ? 'Deselect All' : 'Select All'}
                </button>
                <button onClick={handleBulkDelete} disabled={bulkDeleting}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-bold text-white transition-opacity"
                  style={{ backgroundColor: '#CB460C' }}>
                  {bulkDeleting ? 'Deleting...' : 'Delete Selected'}
                </button>
              </div>
            )}
            <button onClick={() => loadBlobs(provider, activeTab)} disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium"
              style={{ backgroundColor: '#F7EAE5', color: '#CB460C' }}>
              <motion.span animate={loading ? { rotate: 360 } : { rotate: 0 }}
                transition={{ repeat: loading ? Infinity : 0, duration: 1, ease: 'linear' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>
                </svg>
              </motion.span>
              Refresh
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Drop zone */}
          <div
            onClick={() => !uploading && inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); const f = Array.from(e.dataTransfer.files); if (f.length) handleUpload(f) }}
            className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 p-8 cursor-pointer transition-all"
            style={{ borderColor: dragging ? '#CB460C' : '#e5d5cd', backgroundColor: dragging ? '#FFF4F0' : '#FEFCFB' }}>
            <input ref={inputRef} type="file" accept={tab.accept} multiple className="hidden"
              onChange={(e) => { const f = Array.from(e.target.files ?? []); if (f.length) handleUpload(f); e.target.value = '' }} />
            {uploading
              ? <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="w-8 h-8 rounded-full border-2 border-t-transparent"
                  style={{ borderColor: '#CB460C', borderTopColor: 'transparent' }} />
                  <p className="text-sm" style={{ color: '#CB460C' }}>Uploading…</p></>
              : <><div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: '#F7EAE5', color: '#CB460C' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <p className="text-sm font-medium" style={{ color: '#1a1005' }}>
                  Drop {tab.label.toLowerCase()} or <span style={{ color: '#CB460C' }}>browse</span>
                </p>
                <p className="text-xs" style={{ color: '#a89080' }}>Max {tab.maxSizeMb} MB each</p></>
            }
          </div>

          {loading
            ? <div className="flex items-center justify-center py-12">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="w-7 h-7 rounded-full border-2 border-t-transparent"
                  style={{ borderColor: '#CB460C', borderTopColor: 'transparent' }} />
              </div>
            : currentBlobs.length === 0
              ? <div className="flex flex-col items-center justify-center py-12 gap-2">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: '#F7EAE5', color: '#e5d5cd' }}>{tab.icon}</div>
                  <p className="text-sm" style={{ color: '#a89080' }}>No {tab.label.toLowerCase()} yet</p>
                </div>
              : <motion.div layout className="grid gap-3"
                  style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                  <AnimatePresence>
                    {currentBlobs.map((blob) => (
                      <BlobCard
                        key={blob.url}
                        blob={blob}
                        type={activeTab}
                        onDelete={handleDelete}
                        selected={selectedUrls.has(blob.url)}
                        onSelect={toggleSelect}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
          }
        </div>
      </div>
    </div>
  )
}

// ─── ─── ─── ROOT LAYOUT ─── ─── ─── ─────────────────────────────────────────

type AdminSection = 'artists' | 'uploads'

const SECTIONS: { id: AdminSection; label: string; icon: React.ReactNode }[] = [
  {
    id: 'artists',
    label: 'Artists',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
  },
  {
    id: 'uploads',
    label: 'Media Library',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  },
]

const AdminUploadsPage: React.FC = () => {
  const [section, setSection] = useState<AdminSection>('artists')
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }, [])

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F7EAE5' }}>

      {/* ── Sidebar ── */}
      <aside className="w-56 shrink-0 flex flex-col sticky top-0 h-screen border-r"
        style={{ backgroundColor: '#FEFCFB', borderColor: '#e5d5cd' }}>
        <div className="px-5 py-5 border-b" style={{ borderColor: '#e5d5cd' }}>
          <Logo variant="color" className="h-8" />
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-full"
              style={{ backgroundColor: '#F7EAE5', color: '#CB460C' }}>Admin</span>
            <span className="text-xs" style={{ color: '#a89080' }}>Panel</span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {SECTIONS.map((s) => {
            const isActive = s.id === section
            return (
              <button key={s.id} onClick={() => setSection(s.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left"
                style={{ backgroundColor: isActive ? '#F7EAE5' : 'transparent', color: isActive ? '#CB460C' : '#4a3b33' }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = '#F7EAE5' }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent' }}>
                <span style={{ color: isActive ? '#CB460C' : '#a89080' }}>{s.icon}</span>
                {s.label}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t" style={{ borderColor: '#e5d5cd' }}>
          <a href="/" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-colors"
            style={{ color: '#a89080' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#CB460C' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#a89080' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            Back to site
          </a>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top bar */}
        <div className="px-8 py-4 border-b flex items-center gap-3 sticky top-0 z-10"
          style={{ backgroundColor: '#FEFCFB', borderColor: '#e5d5cd' }}>
          {SECTIONS.find((s) => s.id === section)?.icon && (
            <span style={{ color: '#CB460C' }}>{SECTIONS.find((s) => s.id === section)!.icon}</span>
          )}
          <h1 className="text-lg font-semibold" style={{ color: '#1a1005' }}>
            {SECTIONS.find((s) => s.id === section)?.label}
          </h1>
        </div>

        {/* Panel content */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {section === 'artists' && <ArtistsPanel addToast={addToast} />}
          {section === 'uploads' && <UploadsPanel addToast={addToast} />}
        </div>
      </main>

      <ToastContainer toasts={toasts} onRemove={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />
    </div>
  )
}

export default AdminUploadsPage
