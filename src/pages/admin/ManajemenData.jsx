import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import {
  Save, Plus, Trash2, Edit2, X, ChevronDown, ChevronRight,
  Info, Users, GitBranch
} from 'lucide-react'
import OrgStructureEditor from '../../components/OrgStructureEditor'


/* ─── Hitung level dari relasi org_parent ─── */
function computeLevels(groups) {
  const map = {}
  groups.forEach(g => { map[g.position] = g })

  function getLevel(pos, visited = new Set()) {
    if (!pos || visited.has(pos)) return 0
    visited.add(pos)
    const node = map[pos]
    if (!node?.org_parent || !map[node.org_parent]) return 0
    return 1 + getLevel(node.org_parent, visited)
  }

  return groups.map(g => ({ ...g, level: getLevel(g.position) }))
}

/* ─── Layer-based Org Chart ─── */
function LayerOrgChart({ groups, profiles, onReparent }) {
  const [dragging, setDragging] = useState(null)
  const [overNode,  setOverNode] = useState(null)
  const [overLayer, setOverLayer] = useState(null)

  const withLevels = computeLevels(groups)
  const maxLevel   = Math.max(0, ...withLevels.map(g => g.level))
  const layers     = Array.from({ length: maxLevel + 1 }, (_, i) =>
    withLevels.filter(g => g.level === i)
  )

  // Lines: collect parent→child pairs
  const lines = withLevels
    .filter(g => g.org_parent && groups.find(x => x.position === g.org_parent))
    .map(g => ({ from: g.org_parent, to: g.position }))

  /* Drag handlers */
  function handleDragStart(pos) { setDragging(pos) }
  function handleDragEnd()      { setDragging(null); setOverNode(null); setOverLayer(null) }

  async function dropOnNode(targetPos) {
    if (!dragging || dragging === targetPos) return
    setDragging(null); setOverNode(null)
    await onReparent(dragging, targetPos)
  }

  async function dropOnLayer(layerIdx) {
    if (!dragging) return
    // drop on empty layer = set org_parent to null if layer 0, else keep current parent
    // Actually: drop on layer zone with no specific node = make it root of that layer
    // Simplest: layer 0 = root (no parent), layer 1+ = keep existing or set to whatever
    if (layerIdx === 0) {
      setDragging(null); setOverLayer(null)
      await onReparent(dragging, null) // set as root
    }
    setDragging(null); setOverLayer(null)
  }

  return (
    <div style={{ overflowX: 'auto', padding: '1.5rem' }}>
      {layers.map((layerNodes, layerIdx) => (
        <div key={layerIdx}>
          {/* Layer label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{
              fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase',
              color: 'var(--text-muted)', letterSpacing: '0.06em', whiteSpace: 'nowrap'
            }}>
              Layer {layerIdx + 1}
            </div>
            <div style={{ flex: 1, height: 1, background: 'var(--border-light)' }} />
          </div>

          {/* Drop zone row */}
          <div
            onDragOver={e => { e.preventDefault(); setOverLayer(layerIdx) }}
            onDragLeave={() => setOverLayer(null)}
            onDrop={() => dropOnLayer(layerIdx)}
            style={{
              display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
              gap: '1rem', minHeight: 72,
              padding: '0.75rem',
              background: overLayer === layerIdx && dragging ? 'var(--primary-bg)' : 'transparent',
              borderRadius: 'var(--radius-md)',
              border: `2px dashed ${overLayer === layerIdx && dragging ? 'var(--primary)' : 'transparent'}`,
              transition: 'all 0.15s',
              marginBottom: '0.5rem',
            }}
          >
            {layerNodes.length === 0 && overLayer !== layerIdx && (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', alignSelf: 'center', padding: '0 0.5rem' }}>
                (kosong — seret node ke sini)
              </div>
            )}
            {layerNodes.map(node => {
              const isDragging = dragging === node.position
              const isOver     = overNode === node.position
              const people     = node.entries?.map(e =>
                e.profiles ? `${e.profiles.first_name} ${e.profiles.last_name}` : null
              ).filter(Boolean)

              return (
                <div
                  key={node.position}
                  draggable
                  onDragStart={() => handleDragStart(node.position)}
                  onDragEnd={handleDragEnd}
                  onDragOver={e => { e.preventDefault(); e.stopPropagation(); setOverNode(node.position) }}
                  onDragLeave={() => setOverNode(null)}
                  onDrop={e => { e.stopPropagation(); dropOnNode(node.position) }}
                  style={{
                    background: isOver ? 'var(--primary-bg)' : 'var(--surface)',
                    border: `2px solid ${isOver ? 'var(--primary)' : isDragging ? 'var(--accent)' : 'var(--border-light)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    minWidth: 140,
                    cursor: isDragging ? 'grabbing' : 'grab',
                    opacity: isDragging ? 0.4 : 1,
                    transition: 'all 0.15s',
                    userSelect: 'none',
                    boxShadow: isOver ? '0 0 0 4px var(--primary-bg)' : '0 1px 3px rgba(0,0,0,0.07)',
                    position: 'relative',
                  }}
                >
                  <GripVertical size={11} color="var(--text-muted)" style={{ position: 'absolute', top: 6, right: 6 }} />
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                    {node.position}
                  </div>
                  {node.org_parent && (
                    <div style={{ fontSize: '0.68rem', color: 'var(--accent)', marginTop: 2 }}>
                      ↑ {node.org_parent}
                    </div>
                  )}
                  {people?.length > 0 && (
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.4 }}>
                      {people.slice(0, 3).join(', ')}{people.length > 3 ? ` +${people.length - 3}` : ''}
                    </div>
                  )}
                  {isOver && dragging && dragging !== node.position && (
                    <div style={{
                      position: 'absolute', inset: 0, background: 'rgba(var(--primary-rgb),0.08)',
                      borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)'
                    }}>
                      Jadikan anak ↓
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Connector lines to next layer */}
          {layerIdx < maxLevel && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <div style={{ width: 2, height: 24, background: 'var(--border-light)' }} />
            </div>
          )}
        </div>
      ))}

      {layers.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
          Tambahkan jabatan terlebih dahulu
        </div>
      )}

      <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
        🖱 Seret node ke node lain = jadikan anak &nbsp;|&nbsp; Seret ke Layer 1 kosong = jadikan root
      </p>
    </div>
  )
}

/* ─────────────────────────────── MODAL ─────────────────────────────── */
function Modal({ open, title, onClose, children, footer }) {
  if (!open) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1rem' }}>{title}</h3>
          <button className="btn btn-sm btn-ghost" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  )
}


/* ═══════════════════════════ MAIN COMPONENT ═══════════════════════════ */
export default function ManajemenData() {
  /* ── Data ── */
  const [villageInfo, setVillageInfo]   = useState([])
  const [statistik, setStatistik]       = useState(null)
  const [jabatanRaw, setJabatanRaw]     = useState([])  // raw rows from village_structure
  const [jabatanGroups, setJabatanGroups] = useState([]) // grouped by position
  const [profiles, setProfiles]         = useState([])

  /* ── Info Desa ── */
  const [infoExpanded, setInfoExpanded]     = useState(false)
  const [infoModal, setInfoModal]           = useState(null) // {item}
  const [infoEditVal, setInfoEditVal]       = useState('')
  const [misiList, setMisiList]             = useState(['']) // khusus untuk array builder misi

  /* ── Jabatan ── */
  const [jabatanModal, setJabatanModal]     = useState(null) // {mode:'add'|'edit', position?, data?}
  const [jabatanForm, setJabatanForm]       = useState({ newPositionName: '', orgParent: '' })
  const [detailModal, setDetailModal]       = useState(null) // {mode:'add'|'edit', position, item?}
  const [detailForm, setDetailForm]         = useState({ detail: '', profile_id: '' })
  const [expanded, setExpanded]             = useState({})

  /* ── Org Chart ── */
  const [draggingPos, setDraggingPos]       = useState(null)
  const [parentModal, setParentModal]       = useState(null) // {position, current_org_parent}
  const [parentChoice, setParentChoice]     = useState('')

  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchAll() }, [])

  /* ─────── Fetch ─────── */
  async function fetchAll() {
    const [infoRes, structRes, profRes, statRes] = await Promise.all([
      supabase.from('village_info').select('*').order('key'),
      supabase.from('village_structure').select('*, profiles(id, first_name, last_name, avatar_url)').order('sort_order'),
      supabase.from('profiles').select('id, first_name, last_name').eq('status', 'aktif').order('first_name'),
      supabase.from('statistik_kependudukan').select('*').single()
    ])
    if (infoRes.data)   setVillageInfo(infoRes.data)
    if (profRes.data)   setProfiles(profRes.data)
    if (statRes.data)   setStatistik(statRes.data)
    if (structRes.data) {
      setJabatanRaw(structRes.data)
      // Group by position
      const grouped = structRes.data.reduce((acc, row) => {
        if (!acc[row.position]) acc[row.position] = { position: row.position, org_parent: row.org_parent, entries: [] }
        acc[row.position].entries.push(row)
        return acc
      }, {})
      setJabatanGroups(Object.values(grouped))
      // Also auto-expand
      const exp = {}
      Object.keys(grouped).forEach(k => { exp[k] = false })
      setExpanded(ex => ({ ...exp, ...ex }))
    }
  }

  /* ─────── Info Desa: save ─────── */
  async function saveInfo() {
    setSaving(true)
    let finalValue = infoEditVal
    if (infoModal.item.key === 'misi') {
      // Gabungkan misiList menggunakan newline fisik asli (enter sungguhan)
      // bukan teks "\n"
      finalValue = misiList.map(text => text.replace(/^\d+\.\s*/, '').trim()).filter(Boolean).join('\n')
    }

    await supabase.from('village_info').upsert({ ...infoModal.item, value: finalValue })
    setSaving(false)
    setInfoModal(null)
    fetchAll()
  }

  /* ─────── Jabatan: tambah ─────── */
  async function saveNewJabatan() {
    const pos = jabatanForm.newPositionName.trim()
    if (!pos) return
    setSaving(true)
    await supabase.from('village_structure').insert({ 
      position: pos, 
      name: pos, 
      org_parent: jabatanForm.orgParent || null,
      sort_order: jabatanGroups.length + 1 
    })
    setSaving(false)
    setJabatanModal(null)
    setJabatanForm({ newPositionName: '', orgParent: '' })
    fetchAll()
  }

  async function renameJabatan() {
    const pos = jabatanForm.newPositionName.trim()
    if (!pos || !jabatanModal?.position) return
    setSaving(true)
    await supabase.from('village_structure').update({ 
      position: pos,
      org_parent: jabatanForm.orgParent || null
    }).eq('position', jabatanModal.position)
    setSaving(false)
    setJabatanModal(null)
    fetchAll()
  }

  async function deleteJabatanGroup(position) {
    if (!confirm(`Hapus jabatan "${position}" beserta semua detailnya?`)) return
    await supabase.from('village_structure').delete().eq('position', position)
    fetchAll()
  }

  /* ─────── Detail: tambah / edit ─────── */
  async function saveDetail() {
    const prof = profiles.find(p => p.id === detailForm.profile_id)
    setSaving(true)
    if (detailModal.mode === 'add') {
      await supabase.from('village_structure').insert({
        position:   detailModal.position,
        name:       prof ? `${prof.first_name} ${prof.last_name}` : '',
        detail:     detailForm.detail.trim() || null,
        profile_id: detailForm.profile_id || null,
        sort_order: jabatanRaw.length + 1,
      })
    } else {
      await supabase.from('village_structure').update({
        detail:     detailForm.detail.trim() || null,
        profile_id: detailForm.profile_id || null,
        name:       prof ? `${prof.first_name} ${prof.last_name}` : '',
      }).eq('id', detailModal.item.id)
    }
    setSaving(false)
    setDetailModal(null)
    setDetailForm({ detail: '', profile_id: '' })
    fetchAll()
  }

  async function deleteDetail(id) {
    if (!confirm('Hapus entri ini?')) return
    await supabase.from('village_structure').delete().eq('id', id)
    fetchAll()
  }

  /* ─────── Org Chart: drag & drop reparent ─────── */
  async function handleReparent(fromPos, toPos) {
    // toPos = null → jadikan root, toPos = string → jadikan anak dari toPos
    if (fromPos === toPos) return
    const newParent = toPos || null
    const { error } = await supabase
      .from('village_structure')
      .update({ org_parent: newParent })
      .eq('position', fromPos)
    if (error) alert('Gagal update: ' + error.message)
    else fetchAll()
  }

  /* ─────── Build jabatanGroups with entries for LayerOrgChart ─────── */
  const orgGroupsForChart = jabatanGroups

  const infoLabels = {
    sambutan_dukuh:'Sambutan',
    luas_wilayah:'Luas Wilayah (Ha)',visi:'Visi',misi:'Misi',
    hero_title:'Hero Title',hero_subtitle:'Hero Subtitle',
    alamat:'Alamat',telepon:'Telepon',email_desa:'Email Desa',
  }

  // Hitung jumlah RT dan RW dari data village_structure
  // Asumsi: Semua entri yang berposisi berawalan "RT" atau persis "RT" dihitung
  const autoJumlahRT = jabatanRaw.filter(r => r.position.toUpperCase().includes('RT')).length
  const autoJumlahRW = jabatanRaw.filter(r => r.position.toUpperCase().includes('RW')).length
  
  // Baca nama kepala desa / dukuh otomatis
  const headNode = jabatanRaw.find(r => 
    (r.position.toLowerCase().includes('dukuh') || r.position.toLowerCase().includes('kepala')) &&
    !r.position.toLowerCase().includes('keluarga')
  )
  const autoNamaDukuh = headNode?.profiles ? `${headNode.profiles.first_name} ${headNode.profiles.last_name || ''}`.trim() : 'Belum ditentukan di Jabatan'

  return (
    <div className="page-enter">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '0.25rem' }}>Manajemen Data</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Kelola informasi desa, jabatan, dan struktur organisasi</p>
      </div>

      {/* ══════════ SECTION 1: Informasi Desa ══════════ */}
      <div className="card-flat" style={{ marginBottom: '1.5rem' }}>
        <button
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', padding: '1.25rem', fontFamily: 'inherit', textAlign: 'left' }}
          onClick={() => setInfoExpanded(v => !v)}
        >
          <Info size={18} color="var(--primary)" />
          <span style={{ fontWeight: 700, fontSize: '1rem', flex: 1 }}>Informasi Desa</span>
          {infoExpanded ? <ChevronDown size={16} color="var(--text-muted)" /> : <ChevronRight size={16} color="var(--text-muted)" />}
        </button>

        {infoExpanded && (
          <div style={{ padding: '0 1.25rem 1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
            
            {/* Computed Stats (Read-Only) */}
            {[
              { label: 'Kepala Desa (Otomatis)', value: autoNamaDukuh },
              { label: 'Jumlah Penduduk (Otomatis)', value: statistik?.jumlah_penduduk ?? 0 },
              { label: 'Jumlah KK (Otomatis)', value: statistik?.jumlah_kk ?? 0 },
              { label: 'Jumlah RT (Otomatis)', value: autoJumlahRT },
              { label: 'Jumlah RW (Otomatis)', value: autoJumlahRW },
            ].map(stat => (
               <div key={stat.label} style={{ background: '#f8f9fa', borderRadius: 'var(--radius-sm)', padding: '0.75rem', border: '1px solid var(--border-light)' }}>
                 <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary)', marginBottom: '0.25rem' }}>
                   {stat.label}
                 </div>
                 <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                   {stat.value}
                 </div>
               </div>
            ))}

            {/* Editable Village Info */}
            {villageInfo.filter(item => infoLabels[item.key]).map(item => (
              <div key={item.id} style={{ background: 'var(--bg-alt)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', cursor: 'pointer', transition: 'background 0.15s' }}
                onClick={() => { 
                  setInfoModal({ item }); 
                  setInfoEditVal(item.value || '');
                  if (item.key === 'misi') {
                    // Coba pecah berdasarkan newline fisik ATAU string "\n" literal
                    const arr = (item.value || '').split(/\\n|\n/).filter(Boolean)
                    setMisiList(arr.length > 0 ? arr : [''])
                  }
                }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  {infoLabels[item.key] || item.key}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{item.key === 'misi' ? '(Daftar Poin)' : (item.value || '—')}</span>
                  <Edit2 size={12} color="var(--text-muted)" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══════════ SECTION 2: Jabatan ══════════ */}
      <div className="card-flat" style={{ marginBottom: '1.5rem' }}>
        <div style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border-light)' }}>
          <Users size={18} color="var(--primary)" />
          <span style={{ fontWeight: 700, fontSize: '1rem', flex: 1 }}>Jabatan</span>
          <button className="btn btn-sm btn-primary" onClick={() => { setJabatanModal({ mode: 'add' }); setJabatanForm({ newPositionName: '' }) }}>
            <Plus size={14} /> Tambah Jabatan
          </button>
        </div>

        <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {jabatanGroups.length === 0
            ? <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '1.5rem 0' }}>Belum ada jabatan. Klik "Tambah Jabatan".</p>
            : jabatanGroups.map(group => (
              <div key={group.position} style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                {/* Group header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'var(--bg-alt)', cursor: 'pointer' }}
                  onClick={() => setExpanded(ex => ({ ...ex, [group.position]: !ex[group.position] }))}>
                  {expanded[group.position] ? <ChevronDown size={14} color="var(--text-muted)" /> : <ChevronRight size={14} color="var(--text-muted)" />}
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', flex: 1 }}>{group.position}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{group.entries.length} entri</span>
                  <button className="btn btn-sm btn-ghost" title="Edit nama jabatan"
                    onClick={e => { e.stopPropagation(); setJabatanModal({ mode: 'edit', position: group.position }); setJabatanForm({ newPositionName: group.position }) }}>
                    <Edit2 size={13} />
                  </button>
                  <button className="btn btn-sm btn-primary" style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                    onClick={e => { e.stopPropagation(); setDetailModal({ mode: 'add', position: group.position }); setDetailForm({ detail: '', profile_id: '' }) }}>
                    <Plus size={12} /> Detail
                  </button>
                  <button className="btn btn-sm btn-ghost" style={{ color: 'var(--danger)' }} title="Hapus jabatan"
                    onClick={e => { e.stopPropagation(); deleteJabatanGroup(group.position) }}>
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Detail entries */}
                {expanded[group.position] && group.entries.map(entry => (
                  <div key={entry.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 1rem 0.625rem 2.5rem', borderTop: '1px solid var(--border-light)' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', minWidth: 50, color: 'var(--primary)' }}>{entry.detail || '—'}</span>
                    <span style={{ flex: 1, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {entry.profiles ? `${entry.profiles.first_name} ${entry.profiles.last_name}` : <em style={{ color: 'var(--text-muted)' }}>Belum ditentukan</em>}
                    </span>
                    <button className="btn btn-sm btn-ghost"
                      onClick={() => { setDetailModal({ mode: 'edit', position: group.position, item: entry }); setDetailForm({ detail: entry.detail || '', profile_id: entry.profile_id || '' }) }}>
                      <Edit2 size={12} />
                    </button>
                    <button className="btn btn-sm btn-ghost" style={{ color: 'var(--danger)' }} onClick={() => deleteDetail(entry.id)}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            ))
          }
        </div>
      </div>

      {/* ══════════ SECTION 3: Bagan Organisasi ══════════ */}
      <div className="card-flat">
        <div style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border-light)' }}>
          <GitBranch size={18} color="var(--primary)" />
          <span style={{ fontWeight: 700, fontSize: '1rem', flex: 1 }}>Bagan Organisasi</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Atur dari siapa lapor ke siapa, sistem akan generate preview bagannya</span>
        </div>
        <OrgStructureEditor jabatanRaw={jabatanRaw} onSaved={fetchAll} />
      </div>

      {/* ══════════ MODALS ══════════ */}

      {/* Modal: Edit Info Desa */}
      <Modal open={!!infoModal} title={infoLabels[infoModal?.item?.key] || infoModal?.item?.key || ''}
        onClose={() => setInfoModal(null)}
        footer={<>
          <button className="btn btn-ghost" onClick={() => setInfoModal(null)}>Batal</button>
          <button className="btn btn-primary" onClick={saveInfo} disabled={saving}>
            <Save size={14} /> {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </>}>
        {infoModal && (
          infoModal.item.key === 'misi' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Misi akan otomatis diberikan penomoran (1, 2, 3...) saat ditampilkan.</p>
              {misiList.map((m, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 28, height: 28, background: 'var(--primary-bg)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>
                    {idx + 1}
                  </div>
                  <input type="text" className="form-input" value={m.replace(/^\d+\.\s*/, '')}
                    onChange={e => {
                      const nu = [...misiList]; nu[idx] = e.target.value; setMisiList(nu);
                    }} 
                    placeholder="Contoh: Meningkatkan kualitas SDM" />
                  <button className="btn btn-sm btn-ghost" style={{ color: 'var(--danger)', padding: '0 0.5rem' }} 
                    onClick={() => setMisiList(misiList.filter((_, i) => i !== idx))}><Trash2 size={14} /></button>
                </div>
              ))}
              <button className="btn btn-sm" style={{ alignSelf: 'flex-start', marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center', border: '1px solid var(--border-light)', background: 'var(--bg-alt)' }} 
                onClick={() => setMisiList([...misiList, ''])}>
                <Plus size={14} /> Tambah Misi Baru
              </button>
            </div>
          ) : infoModal.item.type === 'text' || infoModal.item.type === 'html' ? (
            <textarea className="form-input" rows={5} value={infoEditVal} onChange={e => setInfoEditVal(e.target.value)} />
          ) : (
            <input type="text" className="form-input" value={infoEditVal} onChange={e => setInfoEditVal(e.target.value)} />
          )
        )}
      </Modal>

      {/* Modal: Tambah / Rename Jabatan */}
      <Modal open={!!jabatanModal}
        title={jabatanModal?.mode === 'add' ? 'Tambah Jabatan Baru' : `Edit Nama Jabatan: ${jabatanModal?.position}`}
        onClose={() => setJabatanModal(null)}
        footer={<>
          <button className="btn btn-ghost" onClick={() => setJabatanModal(null)}>Batal</button>
          <button className="btn btn-primary" disabled={saving}
            onClick={jabatanModal?.mode === 'add' ? saveNewJabatan : renameJabatan}>
            <Save size={14} /> Simpan
          </button>
        </>}>
        <div className="form-group">
          <label className="form-label">Nama Jabatan</label>
          <input type="text" className="form-input" autoFocus
            value={jabatanForm.newPositionName}
            onChange={e => setJabatanForm({ ...jabatanForm, newPositionName: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && (jabatanModal?.mode === 'add' ? saveNewJabatan() : renameJabatan())}
            placeholder="Ketua RT, Kepala Dusun, Sekretaris ..." />

          {jabatanModal?.mode === 'add' && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.6rem' }}>
              Setelah disimpan, klik <strong>+ Detail</strong> untuk menambahkan orang. Anda bisa mengatur Induk Jabatan (hierarki) di panel Bagan Organisasi di bawah.
            </p>
          )}
        </div>
      </Modal>


      {/* Modal: Tambah / Edit Detail */}
      <Modal open={!!detailModal}
        title={detailModal?.mode === 'add' ? `Tambah Detail — ${detailModal?.position}` : `Edit Detail — ${detailModal?.position}`}
        onClose={() => setDetailModal(null)}
        footer={<>
          <button className="btn btn-ghost" onClick={() => setDetailModal(null)}>Batal</button>
          <button className="btn btn-primary" onClick={saveDetail} disabled={saving}>
            <Save size={14} /> Simpan
          </button>
        </>}>
        <div className="form-group">
          <label className="form-label">Nomor / Detail <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>(opsional)</span></label>
          <input type="text" className="form-input" autoFocus
            value={detailForm.detail}
            onChange={e => setDetailForm(f => ({ ...f, detail: e.target.value }))}
            placeholder="17, 5, 001 — kosongkan jika tidak perlu" />
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Untuk RT masukkan nomornya (17, 16, dst). Untuk jabatan tunggal (Dukuh) bisa dikosongkan.
          </p>
        </div>
        <div className="form-group">
          <label className="form-label">Pejabat <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>(opsional)</span></label>
          <select className="form-select" value={detailForm.profile_id} onChange={e => setDetailForm(f => ({ ...f, profile_id: e.target.value }))}>
            <option value="">— Belum ditentukan —</option>
            {profiles.map(p => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
          </select>
        </div>
      </Modal>

    </div>
  )
}
