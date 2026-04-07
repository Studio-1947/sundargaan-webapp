import React, { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { uploadFile, listBlobs, deleteBlob, UploadType, Provider, BlobItem } from '../api/upload'
import Logo from '../components/ui/Logo'

// ─── Tab config ───────────────────────────────────────────────────────────────

interface Tab {
  id: UploadType
  label: string
  prefix: string
  accept: string
  icon: React.ReactNode
  maxSizeMb: number
}

const TABS: Tab[] = [
  {
    id: 'image', label: 'Images', prefix: 'images/',
    accept: 'image/jpeg,image/png,image/webp,image/gif', maxSizeMb: 10,
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>,
  },
  {
    id: 'audio', label: 'Audio', prefix: 'audios/',
    accept: 'audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/flac,audio/aac', maxSizeMb: 50,
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  },
  {
    id: 'video', label: 'Videos', prefix: 'videos/',
    accept: 'video/mp4,video/webm,video/ogg,video/quicktime', maxSizeMb: 200,
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m15 10 4.553-2.276A1 1 0 0 1 21 8.723v6.554a1 1 0 0 1-1.447.894L15 14"/><rect x="2" y="6" width="13" height="12" rx="2"/></svg>,
  },
  {
    id: 'document', label: 'Documents', prefix: 'documents/',
    accept: 'application/pdf,text/plain', maxSizeMb: 20,
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>,
  },
]

// ─── Provider config ──────────────────────────────────────────────────────────

interface ProviderOption {
  id: Provider
  label: string
  description: string
  badge: string
  badgeColor: string
  icon: React.ReactNode
}

const PROVIDERS: ProviderOption[] = [
  {
    id: 'vercel',
    label: 'Vercel Blob',
    description: 'Fast edge CDN · 512 MB free',
    badge: 'Primary',
    badgeColor: '#CB460C',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 19.5h20L12 2z" />
      </svg>
    ),
  },
  {
    id: 'cloudinary',
    label: 'Cloudinary',
    description: 'Media transforms · 25 GB free',
    badge: 'Fallback',
    badgeColor: '#3448c5',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </svg>
    ),
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function getFilename(pathname: string): string {
  return pathname.split('/').pop() ?? pathname
}


// ─── Toast ────────────────────────────────────────────────────────────────────

interface Toast { id: number; type: 'success' | 'error'; message: string }
let toastId = 0

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
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

// ─── ProviderBadge ────────────────────────────────────────────────────────────

function ProviderBadge({ provider }: { provider: Provider }) {
  const isVercel = provider === 'vercel'
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
      style={{
        backgroundColor: isVercel ? '#F7EAE5' : '#EEF0FB',
        color: isVercel ? '#CB460C' : '#3448c5',
      }}
    >
      {isVercel ? '▲ Vercel' : '☁ Cloudinary'}
    </span>
  )
}

// ─── BlobCard ─────────────────────────────────────────────────────────────────

function BlobCard({ blob, type, onDelete }: { blob: BlobItem; type: UploadType; onDelete: (url: string) => void }) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: '#e5d5cd', backgroundColor: '#FEFCFB' }}
    >
      {type === 'image' && (
        <div className="h-40 overflow-hidden" style={{ backgroundColor: '#F7EAE5' }}>
          <img src={blob.url} alt={getFilename(blob.pathname)} className="w-full h-full object-cover" loading="lazy" />
        </div>
      )}
      {type === 'audio' && (
        <div className="px-4 pt-4">
          <audio controls className="w-full h-9" src={blob.url} />
        </div>
      )}
      {type === 'video' && (
        <div className="h-40 overflow-hidden bg-black">
          <video src={blob.url} className="w-full h-full object-contain" muted />
        </div>
      )}

      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium truncate flex-1" style={{ color: '#1a1005' }} title={getFilename(blob.pathname)}>
            {getFilename(blob.pathname)}
          </p>
          <ProviderBadge provider={blob.provider} />
        </div>

        <div className="flex items-center gap-2 text-xs" style={{ color: '#a89080' }}>
          <span>{formatBytes(blob.size)}</span>
          <span>·</span>
          <span>{formatDate(blob.uploadedAt)}</span>
        </div>

        <div className="flex items-center gap-1 rounded-lg px-2 py-1.5" style={{ backgroundColor: '#F7EAE5' }}>
          <a href={blob.url} target="_blank" rel="noopener noreferrer"
            className="flex-1 text-xs truncate hover:underline" style={{ color: '#CB460C' }}>
            {blob.url}
          </a>
          <CopyButton text={blob.url} />
        </div>

        <div className="flex justify-end pt-1">
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: '#a89080' }}>Sure?</span>
              <button className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ backgroundColor: '#CB460C', color: '#fff' }}
                onClick={() => onDelete(blob.url)}>Delete</button>
              <button className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ backgroundColor: '#F7EAE5', color: '#4a3b33' }}
                onClick={() => setConfirmDelete(false)}>Cancel</button>
            </div>
          ) : (
            <button className="text-xs px-3 py-1 rounded-full font-medium transition-colors"
              style={{ backgroundColor: '#F7EAE5', color: '#6b5b4f' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F1D8CD'; e.currentTarget.style.color = '#CB460C' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F7EAE5'; e.currentTarget.style.color = '#6b5b4f' }}
              onClick={() => setConfirmDelete(true)}>Delete</button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─── DropZone ─────────────────────────────────────────────────────────────────

function DropZone({ tab, provider, onUpload, uploading }: { tab: Tab; provider: Provider; onUpload: (files: File[]) => void; uploading: boolean }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const isVercel = provider === 'vercel'

  return (
    <div
      onClick={() => !uploading && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); const f = Array.from(e.dataTransfer.files); if (f.length) onUpload(f) }}
      className="relative rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 p-10 cursor-pointer transition-all duration-200 select-none"
      style={{ borderColor: dragging ? '#CB460C' : '#e5d5cd', backgroundColor: dragging ? '#FFF4F0' : '#FEFCFB' }}
    >
      <input ref={inputRef} type="file" accept={tab.accept} multiple className="hidden"
        onChange={(e) => { const f = Array.from(e.target.files ?? []); if (f.length) onUpload(f); e.target.value = '' }} />

      {uploading ? (
        <>
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-10 h-10 rounded-full border-2 border-t-transparent"
            style={{ borderColor: '#CB460C', borderTopColor: 'transparent' }} />
          <p className="text-sm font-medium" style={{ color: '#CB460C' }}>Uploading to {isVercel ? 'Vercel Blob' : 'Cloudinary'}…</p>
        </>
      ) : (
        <>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: '#F7EAE5', color: '#CB460C' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium" style={{ color: '#1a1005' }}>
              Drop {tab.label.toLowerCase()} here or <span style={{ color: '#CB460C' }}>browse</span>
            </p>
            <p className="text-xs mt-1" style={{ color: '#a89080' }}>
              Uploading to <span style={{ color: isVercel ? '#CB460C' : '#3448c5', fontWeight: 600 }}>
                {isVercel ? 'Vercel Blob' : 'Cloudinary'}
              </span> · Max {tab.maxSizeMb} MB each
            </p>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Provider Toggle ──────────────────────────────────────────────────────────

function ProviderToggle({ active, onChange }: { active: Provider; onChange: (p: Provider) => void }) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl border" style={{ backgroundColor: '#F7EAE5', borderColor: '#e5d5cd' }}>
      {PROVIDERS.map((p) => {
        const isActive = p.id === active
        return (
          <button
            key={p.id}
            onClick={() => onChange(p.id)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150"
            style={{
              backgroundColor: isActive ? '#FEFCFB' : 'transparent',
              color: isActive ? (p.id === 'vercel' ? '#CB460C' : '#3448c5') : '#6b5b4f',
              boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            <span style={{ color: isActive ? (p.id === 'vercel' ? '#CB460C' : '#3448c5') : '#a89080' }}>
              {p.icon}
            </span>
            <span>{p.label}</span>
            {isActive && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                style={{ backgroundColor: p.id === 'vercel' ? '#F7EAE5' : '#EEF0FB', color: p.id === 'vercel' ? '#CB460C' : '#3448c5' }}>
                {p.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const AdminUploadsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<UploadType>('image')
  const [provider, setProvider] = useState<Provider>('vercel')
  const [blobs, setBlobs] = useState<Record<string, BlobItem[]>>({})
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])

  const tab = TABS.find((t) => t.id === activeTab)!
  const cacheKey = `${provider}:${activeTab}`

  const addToast = (type: Toast['type'], message: string) => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }

  const loadBlobs = useCallback(async (p: Provider, t: UploadType) => {
    setLoading(true)
    try {
      const key = `${p}:${t}`
      const prefix = p === 'vercel' ? TABS.find((tb) => tb.id === t)!.prefix : undefined
      const items = await listBlobs(p, t, prefix)
      setBlobs((prev) => ({ ...prev, [key]: items }))
    } catch (e: any) {
      addToast('error', e.message ?? 'Failed to load files')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadBlobs(provider, activeTab)
  }, [provider, activeTab, loadBlobs])

  const handleProviderChange = (p: Provider) => {
    setProvider(p)
  }

  const handleUpload = async (files: File[]) => {
    setUploading(true)
    let successCount = 0
    const errors: string[] = []

    for (const file of files) {
      try {
        const result = await uploadFile(file, activeTab, provider)
        const newBlob: BlobItem = {
          url:        result.url,
          pathname:   result.pathname,
          size:       result.size,
          uploadedAt: new Date().toISOString(),
          provider:   result.provider,
        }
        setBlobs((prev) => ({ ...prev, [cacheKey]: [newBlob, ...(prev[cacheKey] ?? [])] }))
        successCount++
      } catch (e: any) {
        errors.push(`${file.name}: ${e.message}`)
      }
    }

    setUploading(false)
    if (successCount > 0)
      addToast('success', `${successCount} file${successCount > 1 ? 's' : ''} uploaded to ${provider === 'vercel' ? 'Vercel Blob' : 'Cloudinary'}`)
    errors.forEach((msg) => addToast('error', msg))
  }

  const handleDelete = async (url: string) => {
    try {
      await deleteBlob(url, provider)
      setBlobs((prev) => ({ ...prev, [cacheKey]: (prev[cacheKey] ?? []).filter((b) => b.url !== url) }))
      addToast('success', 'File deleted')
    } catch (e: any) {
      addToast('error', e.message ?? 'Delete failed')
    }
  }

  const currentBlobs = blobs[cacheKey] ?? []
  const currentProvider = PROVIDERS.find((p) => p.id === provider)!

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F7EAE5' }}>

      {/* ── Sidebar ── */}
      <aside className="w-64 shrink-0 flex flex-col sticky top-0 h-screen border-r"
        style={{ backgroundColor: '#FEFCFB', borderColor: '#e5d5cd' }}>

        <div className="px-6 py-6 border-b" style={{ borderColor: '#e5d5cd' }}>
          <Logo variant="color" className="h-10" />
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-full"
              style={{ backgroundColor: '#F7EAE5', color: '#CB460C' }}>Admin</span>
            <span className="text-xs" style={{ color: '#a89080' }}>Uploads</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {TABS.map((t) => {
            const isActive = t.id === activeTab
            const count = (blobs[`${provider}:${t.id}`] ?? []).length
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 text-left"
                style={{ backgroundColor: isActive ? '#F7EAE5' : 'transparent', color: isActive ? '#CB460C' : '#4a3b33' }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = '#F7EAE5' }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <span style={{ color: isActive ? '#CB460C' : '#a89080' }}>{t.icon}</span>
                {t.label}
                {count > 0 && (
                  <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: isActive ? '#CB460C' : '#e5d5cd', color: isActive ? '#fff' : '#6b5b4f' }}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Storage info panel */}
        <div className="mx-4 mb-4 p-3 rounded-xl border" style={{ borderColor: '#e5d5cd', backgroundColor: '#F7EAE5' }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#a89080' }}>Active Storage</p>
          <div className="flex items-center gap-2">
            <span style={{ color: currentProvider.id === 'vercel' ? '#CB460C' : '#3448c5' }}>
              {currentProvider.icon}
            </span>
            <div>
              <p className="text-xs font-semibold" style={{ color: '#1a1005' }}>{currentProvider.label}</p>
              <p className="text-[10px]" style={{ color: '#a89080' }}>{currentProvider.description}</p>
            </div>
          </div>
        </div>

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
      <main className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <div className="px-8 py-5 border-b flex items-center justify-between gap-4 sticky top-0 z-10"
          style={{ backgroundColor: '#FEFCFB', borderColor: '#e5d5cd' }}>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold" style={{ color: '#1a1005' }}>{tab.label}</h1>
            <p className="text-sm mt-0.5 truncate" style={{ color: '#a89080' }}>
              {currentBlobs.length} file{currentBlobs.length !== 1 ? 's' : ''} on{' '}
              <span style={{ color: currentProvider.id === 'vercel' ? '#CB460C' : '#3448c5', fontWeight: 600 }}>
                {currentProvider.label}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <ProviderToggle active={provider} onChange={handleProviderChange} />
            <button
              onClick={() => loadBlobs(provider, activeTab)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors"
              style={{ backgroundColor: '#F7EAE5', color: '#CB460C' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F1D8CD' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F7EAE5' }}
            >
              <motion.span animate={loading ? { rotate: 360 } : { rotate: 0 }}
                transition={{ repeat: loading ? Infinity : 0, duration: 1, ease: 'linear' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                  <path d="M21 3v5h-5"/>
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                  <path d="M8 16H3v5"/>
                </svg>
              </motion.span>
              Refresh
            </button>
          </div>
        </div>

        <div className="flex-1 p-8 space-y-8">
          <DropZone tab={tab} provider={provider} onUpload={handleUpload} uploading={uploading} />

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-8 h-8 rounded-full border-2 border-t-transparent"
                style={{ borderColor: '#CB460C', borderTopColor: 'transparent' }} />
            </div>
          ) : currentBlobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: '#F7EAE5', color: '#e5d5cd' }}>{tab.icon}</div>
              <p className="text-sm" style={{ color: '#a89080' }}>
                No {tab.label.toLowerCase()} on {currentProvider.label} yet
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: '#a89080' }}>
                Uploaded Files
              </p>
              <motion.div layout className="grid gap-4"
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                <AnimatePresence>
                  {currentBlobs.map((blob) => (
                    <BlobCard key={blob.url} blob={blob} type={activeTab} onDelete={handleDelete} />
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </div>
      </main>

      <ToastContainer toasts={toasts} onRemove={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />
    </div>
  )
}

export default AdminUploadsPage
