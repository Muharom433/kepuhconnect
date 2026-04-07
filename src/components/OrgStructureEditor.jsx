import { useState, useEffect } from 'react'
import { Tree, TreeNode } from 'react-organizational-chart'
import { supabase } from '../lib/supabase'
import { Save, Check, AlertCircle, User } from 'lucide-react'

// Bangun tree dari baris individu
function buildTree(rows) {
  const map = {}
  rows.forEach(r => { map[r.id] = { ...r, children: [] } })
  const roots = []
  rows.forEach(r => {
    const pId = r.org_parent
    if (pId && map[pId]) map[pId].children.push(map[r.id])
    else roots.push(map[r.id])
  })
  return roots
}

const COLORS = ['#1b4332', '#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2']

function SingleCard({ node, color }) {
  const { profiles: p, position, detail } = node
  return (
    <div style={{
      display: 'inline-block',
      background: '#fff',
      border: `2px solid ${color}`,
      borderRadius: 10,
      padding: '10px 18px',
      minWidth: 140,
      textAlign: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
    }}>
      {p?.avatar_url ? (
        <img src={p.avatar_url} alt="" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', marginBottom: 6, border: `2px solid ${color}` }} />
      ) : (
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${color}15`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px' }}>
          <User size={24} />
        </div>
      )}
      <div style={{ fontWeight: 800, fontSize: '0.72rem', color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {position} {detail && <span style={{ opacity: 0.8 }}>({detail})</span>}
      </div>
      {p && (
        <div style={{ fontSize: '0.78rem', color: '#555', marginTop: 2 }}>
          {p.first_name} {p.last_name}
        </div>
      )}
      {!p && (
        <div style={{ fontSize: '0.7rem', color: '#999', fontStyle: 'italic', marginTop: 2 }}>Belum ditentukan</div>
      )}
    </div>
  )
}

// Rekursif Render Sub-tree
function renderTree(nodes, depth = 1) {
  return nodes.map(node => {
    const color = COLORS[depth % COLORS.length]
    return (
      <TreeNode key={node.id} label={<SingleCard node={node} color={color} />}>
        {node.children?.length > 0 ? renderTree(node.children, depth + 1) : undefined}
      </TreeNode>
    )
  })
}

/* ═══════════ MAIN ═══════════ */
export default function OrgStructureEditor({ jabatanRaw: initialRows, onSaved }) {
  // state parents maps row.id -> parent.id (org_parent)
  const [parents, setParents] = useState({})
  const [saving, setSaving] = useState(false)
  const [savedOk, setSavedOk] = useState(false)

  useEffect(() => {
    const map = {}
    initialRows.forEach(r => { map[r.id] = r.org_parent || '' })
    setParents(map)
  }, [initialRows])

  // Merge untuk live preview
  const previewRows = initialRows.map(r => ({
    ...r,
    org_parent: parents[r.id] || null,
  }))
  const roots = buildTree(previewRows)

  // Pencegahan loop
  function wouldCycle(nodeId, newParentId) {
    if (!newParentId) return false
    let cur = newParentId
    const visited = new Set()
    while (cur) {
      if (cur === nodeId) return true
      if (visited.has(cur)) break
      visited.add(cur)
      cur = parents[cur] || ''
    }
    return false
  }

  function handleParentChange(nodeId, newParentId) {
    if (newParentId && wouldCycle(nodeId, newParentId)) {
      alert('Tidak boleh memutar: jabatan tidak bisa menunjuk bagian dari struktur bawahannya sebagai induk!')
      return
    }
    setParents(p => ({ ...p, [nodeId]: newParentId }))
    setSavedOk(false)
  }

  async function saveAll() {
    setSaving(true)
    const promises = initialRows.map(r => {
      const newParent = parents[r.id] || null
      // Check if actually changed
      const oldParent = r.org_parent || null
      // We used to store text, now we store UUID. 
      // If it changed, we update DB.
      if (newParent === oldParent) return Promise.resolve()
      return supabase.from('village_structure')
        .update({ org_parent: newParent })
        .eq('id', r.id)
    })
    await Promise.all(promises)
    setSaving(false)
    setSavedOk(true)
    onSaved?.()
    setTimeout(() => setSavedOk(false), 3000)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem', padding: '1.25rem' }}>

      {/* ── KIRI: Pengaturan Hierarki Individu ── */}
      <div>
        <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h4 style={{ fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>Atur Posisi per Orang / Jabatan</h4>
          <button
            onClick={saveAll}
            disabled={saving}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.375rem',
              background: savedOk ? '#40916c' : 'var(--primary, #2d6a4f)',
              color: '#fff', border: 'none', borderRadius: 8,
              padding: '6px 14px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700,
              opacity: saving ? 0.7 : 1,
            }}
          >
            {savedOk ? <><Check size={13} /> Tersimpan!</> : saving ? 'Menyimpan...' : <><Save size={13} /> Simpan Bagan</>}
          </button>
        </div>

        {initialRows.length === 0 ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: '#999', fontSize: '0.85rem' }}>
            Tambahkan jabatan dan orang terlebih dahulu.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '550px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {/* Group by Position to make it easier to read */}
            {(() => {
              // Preserve original order by building a map
              const groups = {}
              const order = []
              initialRows.forEach(r => {
                if (!groups[r.position]) {
                  groups[r.position] = []
                  order.push(r.position)
                }
                groups[r.position].push(r)
              })

              return order.map((posName, idx) => {
                const groupColor = COLORS[idx % COLORS.length]
                return (
                  <div key={posName}>
                    <div style={{ 
                      fontSize: '0.75rem', fontWeight: 800, color: groupColor, 
                      textTransform: 'uppercase', marginBottom: '0.5rem', 
                      display: 'flex', alignItems: 'center', gap: '0.5rem'
                    }}>
                      <div style={{ width: 12, height: 12, borderRadius: '50%', background: groupColor }} />
                      Grup: {posName}
                      <div style={{ flex: 1, height: 1, background: 'var(--border-light)' }} />
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '0.5rem', borderLeft: `2px solid ${groupColor}40` }}>
                      {groups[posName].map(r => {
                        return (
                          <div key={r.id} style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            background: 'var(--bg-alt)', borderRadius: 8, padding: '0.625rem 0.875rem',
                            border: '1px solid var(--border-light)',
                          }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{r.position} {r.detail && `(${r.detail})`}</span>
                              <span style={{ fontSize: '0.7rem', color: '#666' }}>{r.profiles ? `${r.profiles.first_name} ${r.profiles.last_name}` : 'Belum ada orang'}</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 160 }}>
                              <label style={{ fontSize: '0.62rem', color: '#999', fontWeight: 600, textTransform: 'uppercase' }}>Atasan / Induk Jabatan</label>
                              <select
                                value={parents[r.id] || ''}
                                onChange={e => handleParentChange(r.id, e.target.value)}
                                style={{
                                  fontSize: '0.82rem', padding: '6px 8px', maxWidth: '160px',
                                  border: '1px solid var(--border-light)', borderRadius: 6,
                                  background: '#fff', cursor: 'pointer',
                                }}
                              >
                                <option value="">— Tidak ada (Posisi Pucuk) —</option>
                                {initialRows.filter(p => p.id !== r.id).map(p => (
                                  <option key={p.id} value={p.id}>{p.position} {p.detail && `(${p.detail})`} {p.profiles && `- ${p.profiles.first_name}`}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })
            })()}
          </div>
        )}
      </div>

      {/* ── KANAN: Preview Bagan ── */}
      <div>
        <h4 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem', marginTop: 0 }}>
          Preview Bagan Organisasi
        </h4>
        <div style={{
          overflowX: 'auto', padding: '2rem 1rem',
          background: 'var(--bg-alt)', borderRadius: 10,
          minHeight: 200, textAlign: 'center',
          border: '1px solid var(--border-light)',
        }}>
          {roots.length === 0 ? (
            <div style={{ color: '#999', fontSize: '0.85rem' }}>Belum ada hierarki.</div>
          ) : (
            roots.map((root, i) => {
              const color = COLORS[0]
              return (
                <div key={root.id} style={{ marginBottom: i < roots.length - 1 ? '3rem' : 0 }}>
                  <Tree lineWidth="3px" lineColor="#8bb19b" lineBorderRadius="6px" lineHeight="30px" nodePadding="6px"
                    label={<SingleCard node={root} color={color} />}>
                    {root.children?.length > 0 ? renderTree(root.children, 1) : undefined}
                  </Tree>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
