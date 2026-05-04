import { useMemo, useState } from 'react'
import './App.css'

const CHECKLIST_ITEMS = [
  { id: 'vis-01', category: 'Visual', label: 'Surface free of scratches', criteria: 'No visible scratch deeper than 0.2mm' },
  { id: 'vis-02', category: 'Visual', label: 'Label alignment', criteria: 'Label is centered within 2mm' },
  { id: 'vis-03', category: 'Visual', label: 'Paint consistency', criteria: 'No bubbling or color shift' },
  { id: 'dim-01', category: 'Dimensional', label: 'Housing width check', criteria: 'Width between 42.8mm and 43.2mm' },
  { id: 'dim-02', category: 'Dimensional', label: 'Hole spacing check', criteria: 'Spacing 16mm plus or minus 0.3mm' },
  { id: 'dim-03', category: 'Dimensional', label: 'Connector depth', criteria: 'Depth between 7.8mm and 8.2mm' },
  { id: 'asm-01', category: 'Assembly', label: 'Fastener torque mark', criteria: 'Torque mark visible on all fasteners' },
  { id: 'asm-02', category: 'Assembly', label: 'Wire routing check', criteria: 'No pinching, no twist, no loose run' },
  { id: 'asm-03', category: 'Assembly', label: 'Seal integrity', criteria: 'Seal fully seated with no gaps' },
  { id: 'ele-01', category: 'Electrical', label: 'Power-on indicator', criteria: 'LED indicator turns green in under 3 sec' },
  { id: 'ele-02', category: 'Electrical', label: 'Continuity spot check', criteria: 'Continuity passes on test probe' },
  { id: 'ele-03', category: 'Electrical', label: 'Sensor handshake', criteria: 'Handshake packet returns success code' },
]

const LINE_OPTIONS = ['Line A - Chassis', 'Line B - Final Assembly', 'Line C - Test Cell', 'Line D - Packout']

const STATUS_META = {
  Pass: { className: 'pass', short: 'PASS' },
  Fail: { className: 'fail', short: 'FAIL' },
  Flag: { className: 'flag', short: 'FLAG' },
}

function createDraftInspection(lineId, unitId) {
  return {
    lineId,
    unitId,
    startedAt: new Date().toISOString(),
    items: CHECKLIST_ITEMS.map((item) => ({
      ...item,
      status: '',
      note: '',
      photos: [],
    })),
  }
}

function statusTotals(items) {
  return items.reduce(
    (acc, item) => {
      if (item.status === 'Pass') acc.pass += 1
      if (item.status === 'Fail') acc.fail += 1
      if (item.status === 'Flag') acc.flag += 1
      return acc
    },
    { pass: 0, fail: 0, flag: 0 },
  )
}

function itemValidationError(item) {
  if (item.status === 'Fail') {
    if (item.note.trim().length < 5) return 'Fail requires a note with at least 5 characters.'
    if (item.photos.length < 1) return 'Fail requires at least one photo.'
  }

  if (item.status === 'Flag' && item.note.trim().length < 5) {
    return 'Flag requires a note with at least 5 characters.'
  }

  return ''
}

function App() {
  const [view, setView] = useState('home')
  const [lineId, setLineId] = useState(LINE_OPTIONS[0])
  const [unitId, setUnitId] = useState('')
  const [draft, setDraft] = useState(null)
  const [activeItemId, setActiveItemId] = useState('')
  const [detailNote, setDetailNote] = useState('')
  const [detailPhotos, setDetailPhotos] = useState([])
  const [recentInspections, setRecentInspections] = useState([
    {
      inspectionId: 'INSP-2419',
      lineId: 'Line B - Final Assembly',
      unitId: 'U-18320',
      timestamp: '2026-05-04T08:42:00.000Z',
      totals: { pass: 10, fail: 1, flag: 1 },
      flaggedItems: [
        {
          id: 'vis-02',
          label: 'Label alignment',
          status: 'Flag',
          note: 'Slight offset, monitor next 5 units.',
          photoCount: 0,
        },
        {
          id: 'asm-02',
          label: 'Wire routing check',
          status: 'Fail',
          note: 'Pinch point near bracket edge.',
          photoCount: 1,
        },
      ],
    },
  ])

  const activeItem = useMemo(
    () => draft?.items.find((item) => item.id === activeItemId) ?? null,
    [draft, activeItemId],
  )

  const groupedItems = useMemo(() => {
    if (!draft) return {}

    return draft.items.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push(item)
      return acc
    }, {})
  }, [draft])

  const completion = useMemo(() => {
    if (!draft) return { completed: 0, total: 0 }
    const completed = draft.items.filter((item) => item.status).length
    return { completed, total: draft.items.length }
  }, [draft])

  const inspectionErrors = useMemo(() => {
    if (!draft) return []
    return draft.items
      .map((item) => ({ id: item.id, label: item.label, error: itemValidationError(item) }))
      .filter((item) => item.error)
  }, [draft])

  const canSubmit =
    !!draft &&
    completion.completed === completion.total &&
    inspectionErrors.length === 0 &&
    draft.lineId &&
    draft.unitId.trim().length > 0

  const openDetail = (item) => {
    setActiveItemId(item.id)
    setDetailNote(item.note)
    setDetailPhotos(item.photos)
  }

  const closeDetail = () => {
    setActiveItemId('')
    setDetailNote('')
    setDetailPhotos([])
  }

  const updateItemStatus = (itemId, status) => {
    setDraft((prev) => {
      if (!prev) return prev
      const nextItems = prev.items.map((item) => {
        if (item.id !== itemId) return item
        if (status === 'Pass') {
          return { ...item, status, note: '', photos: [] }
        }
        return { ...item, status }
      })
      return { ...prev, items: nextItems }
    })

    if (status === 'Fail' || status === 'Flag') {
      const target = draft?.items.find((item) => item.id === itemId)
      if (target) openDetail({ ...target, status })
    }
  }

  const saveDetail = () => {
    if (!activeItemId) return

    setDraft((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        items: prev.items.map((item) =>
          item.id === activeItemId
            ? {
                ...item,
                note: detailNote,
                photos: detailPhotos,
              }
            : item,
        ),
      }
    })

    closeDetail()
  }

  const startInspection = () => {
    const unit = unitId.trim()
    if (!unit) return
    setDraft(createDraftInspection(lineId, unit))
    setView('checklist')
  }

  const submitInspection = () => {
    if (!draft || !canSubmit) return

    const totals = statusTotals(draft.items)
    const flaggedItems = draft.items
      .filter((item) => item.status === 'Fail' || item.status === 'Flag')
      .map((item) => ({
        id: item.id,
        label: item.label,
        status: item.status,
        note: item.note,
        photoCount: item.photos.length,
      }))

    const inspectionId = `INSP-${Math.floor(1000 + Math.random() * 9000)}`
    const now = new Date().toISOString()

    setRecentInspections((prev) => [
      {
        inspectionId,
        lineId: draft.lineId,
        unitId: draft.unitId,
        timestamp: now,
        totals,
        flaggedItems,
      },
      ...prev,
    ])

    setDraft(null)
    setUnitId('')
    setView('confirmation')
  }

  const todayStats = useMemo(() => {
    const today = new Date().toDateString()
    const todayInspections = recentInspections.filter(
      (inspection) => new Date(inspection.timestamp).toDateString() === today,
    )
    const openFlags = todayInspections.reduce(
      (sum, inspection) => sum + inspection.flaggedItems.length,
      0,
    )
    return { inspections: todayInspections.length, openFlags }
  }, [recentInspections])

  const flaggedQueue = useMemo(
    () =>
      recentInspections.flatMap((inspection) =>
        inspection.flaggedItems.map((item) => ({
          ...item,
          inspectionId: inspection.inspectionId,
          lineId: inspection.lineId,
          unitId: inspection.unitId,
          timestamp: inspection.timestamp,
        })),
      ),
    [recentInspections],
  )

  return (
    <main className="app-shell">
      <header className="top-bar fade-in">
        <div>
          <p className="eyebrow">Protogen P303</p>
          <h1>Inspector Mobile Tool</h1>
        </div>
        <button className="ghost-btn" type="button" onClick={() => setView('home')}>
          Home
        </button>
      </header>

      {view === 'home' && (
        <section className="stack fade-in">
          <div className="panel hero-panel">
            <h2>Floor Inspection</h2>
            <p>Complete one unit at a time. Fast, documented, and traceable.</p>
            <button className="primary-btn" type="button" onClick={() => setView('setup')}>
              New Inspection
            </button>
          </div>

          <div className="stats-grid">
            <article className="panel stat-card">
              <p className="stat-label">Today</p>
              <p className="stat-value">{todayStats.inspections}</p>
              <p className="muted">Inspections completed</p>
            </article>
            <article className="panel stat-card">
              <p className="stat-label">Open Flags</p>
              <p className="stat-value">{todayStats.openFlags}</p>
              <p className="muted">Requires follow-up</p>
            </article>
          </div>

          <div className="quick-actions panel">
            <button type="button" onClick={() => setView('recent')}>
              Recent Inspections
            </button>
            <button type="button" onClick={() => setView('flags')}>
              Flagged Items
            </button>
            <button type="button" onClick={() => setView('criteria')}>
              Criteria Reference
            </button>
          </div>
        </section>
      )}

      {view === 'setup' && (
        <section className="stack fade-in">
          <article className="panel">
            <h2>Start New Inspection</h2>
            <label>
              Line
              <select value={lineId} onChange={(event) => setLineId(event.target.value)}>
                {LINE_OPTIONS.map((line) => (
                  <option key={line} value={line}>
                    {line}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Unit ID
              <input
                type="text"
                value={unitId}
                onChange={(event) => setUnitId(event.target.value)}
                placeholder="Scan or enter unit ID"
              />
            </label>
            <button
              className="primary-btn"
              type="button"
              disabled={!unitId.trim()}
              onClick={startInspection}
            >
              Start Inspection
            </button>
          </article>
        </section>
      )}

      {view === 'checklist' && draft && (
        <section className="stack fade-in">
          <article className="panel summary-strip">
            <div>
              <p className="muted">{draft.lineId}</p>
              <strong>{draft.unitId}</strong>
            </div>
            <p>
              {completion.completed}/{completion.total} complete
            </p>
          </article>

          {Object.entries(groupedItems).map(([category, items], index) => (
            <article className="panel stagger" style={{ '--stagger': index }} key={category}>
              <h3>{category}</h3>
              <ul className="item-list">
                {items.map((item) => {
                  const itemError = itemValidationError(item)
                  return (
                    <li key={item.id} className="check-item">
                      <div className="item-head">
                        <div>
                          <strong>{item.label}</strong>
                          <p className="muted">{item.criteria}</p>
                        </div>
                        {item.status && <span className={`chip ${STATUS_META[item.status].className}`}>{STATUS_META[item.status].short}</span>}
                      </div>
                      <div className="status-row" role="group" aria-label={`${item.label} status`}>
                        {['Pass', 'Fail', 'Flag'].map((status) => (
                          <button
                            key={status}
                            type="button"
                            className={`status-btn ${STATUS_META[status].className} ${item.status === status ? 'active' : ''}`}
                            onClick={() => updateItemStatus(item.id, status)}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                      {(item.status === 'Fail' || item.status === 'Flag') && (
                        <div className="evidence-row">
                          <p className={itemError ? 'error-text' : 'muted'}>
                            Note: {item.note ? 'Added' : 'Missing'} | Photos: {item.photos.length}
                          </p>
                          <button type="button" onClick={() => openDetail(item)}>
                            {item.note || item.photos.length ? 'Edit Details' : 'Add Details'}
                          </button>
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </article>
          ))}

          <button className="primary-btn sticky-btn" type="button" onClick={() => setView('review')}>
            Review & Submit
          </button>
        </section>
      )}

      {view === 'review' && draft && (
        <section className="stack fade-in">
          <article className="panel">
            <h2>Review Inspection</h2>
            <p className="muted">
              {draft.lineId} | {draft.unitId}
            </p>
            <div className="totals-row">
              <span className="chip pass">Pass {statusTotals(draft.items).pass}</span>
              <span className="chip fail">Fail {statusTotals(draft.items).fail}</span>
              <span className="chip flag">Flag {statusTotals(draft.items).flag}</span>
            </div>
            {inspectionErrors.length > 0 ? (
              <div className="error-box" role="alert">
                <h3>Resolve Before Submit</h3>
                <ul>
                  {inspectionErrors.map((entry) => (
                    <li key={entry.id}>
                      <strong>{entry.label}:</strong> {entry.error}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="good-text">All required fields complete. Ready to submit.</p>
            )}
            <div className="row-actions">
              <button type="button" onClick={() => setView('checklist')}>
                Back to Checklist
              </button>
              <button className="primary-btn" type="button" disabled={!canSubmit} onClick={submitInspection}>
                Submit Inspection
              </button>
            </div>
          </article>
        </section>
      )}

      {view === 'confirmation' && (
        <section className="stack fade-in">
          <article className="panel confirm-card">
            <h2>Inspection Submitted</h2>
            <p>Report captured successfully and added to today's history.</p>
            <div className="row-actions">
              <button className="primary-btn" type="button" onClick={() => setView('setup')}>
                Inspect Next Unit
              </button>
              <button type="button" onClick={() => setView('recent')}>
                View Recent
              </button>
            </div>
          </article>
        </section>
      )}

      {view === 'recent' && (
        <section className="stack fade-in">
          <article className="panel">
            <h2>Recent Inspections</h2>
            <ul className="history-list">
              {recentInspections.map((inspection) => (
                <li key={inspection.inspectionId}>
                  <div>
                    <strong>{inspection.inspectionId}</strong>
                    <p className="muted">
                      {inspection.lineId} | {inspection.unitId}
                    </p>
                  </div>
                  <div className="totals-row">
                    <span className="chip pass">{inspection.totals.pass}</span>
                    <span className="chip fail">{inspection.totals.fail}</span>
                    <span className="chip flag">{inspection.totals.flag}</span>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </section>
      )}

      {view === 'flags' && (
        <section className="stack fade-in">
          <article className="panel">
            <h2>Flagged Items</h2>
            {flaggedQueue.length === 0 ? (
              <p className="muted">No open flagged items.</p>
            ) : (
              <ul className="history-list">
                {flaggedQueue.map((item) => (
                  <li key={`${item.inspectionId}-${item.id}`}>
                    <div>
                      <span className={`chip ${STATUS_META[item.status].className}`}>{item.status}</span>
                      <strong>{item.label}</strong>
                      <p className="muted">
                        {item.lineId} | Unit {item.unitId} | {item.inspectionId}
                      </p>
                      <p className="muted">Note: {item.note || 'None'} | Photos: {item.photoCount}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </section>
      )}

      {view === 'criteria' && (
        <section className="stack fade-in">
          <article className="panel">
            <h2>Inspection Criteria</h2>
            <ul className="criteria-list">
              {CHECKLIST_ITEMS.map((item) => (
                <li key={item.id}>
                  <strong>
                    [{item.category}] {item.label}
                  </strong>
                  <p className="muted">{item.criteria}</p>
                </li>
              ))}
            </ul>
          </article>
        </section>
      )}

      {activeItem && (
        <section className="modal-scrim" role="dialog" aria-modal="true" aria-label="Issue details">
          <article className="modal-card">
            <h3>{activeItem.label}</h3>
            <p className="muted">{activeItem.status} details</p>
            <label>
              Note
              <textarea
                value={detailNote}
                onChange={(event) => setDetailNote(event.target.value)}
                rows={4}
                placeholder="Add quick observation..."
              />
            </label>
            <label>
              Photos
              <input
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={(event) => {
                  const files = Array.from(event.target.files ?? []).map((file) => file.name)
                  setDetailPhotos(files)
                }}
              />
            </label>
            <p className="muted">{detailPhotos.length} file(s) selected</p>
            <div className="row-actions">
              <button type="button" onClick={closeDetail}>
                Cancel
              </button>
              <button className="primary-btn" type="button" onClick={saveDetail}>
                Save Details
              </button>
            </div>
          </article>
        </section>
      )}
    </main>
  )
}

export default App
