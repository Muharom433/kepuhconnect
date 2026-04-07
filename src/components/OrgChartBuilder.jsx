import { useState, useCallback, useEffect, useRef } from 'react'
import ReactFlow, {
  Controls, Background, MiniMap, addEdge,
  useNodesState, useEdgesState, MarkerType, Panel,
  useReactFlow, ReactFlowProvider
} from 'reactflow'
import 'reactflow/dist/style.css'
import { supabase } from '../lib/supabase'
import { Save, RefreshCw, Info } from 'lucide-react'

// Custom node sama persis seperti yang indah kemarin
function OrgCardNode({ data }) {
  return (
    <div style={{
      background: 'var(--surface, #fff)',
      border: `2px solid ${data.color || 'var(--primary, #4a7c59)'}`,
      borderRadius: 10,
      padding: '10px 16px',
      minWidth: 150,
      maxWidth: 200,
      boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
      fontFamily: 'inherit',
      textAlign: 'center',
    }}>
      {data.avatar ? (
        <img src={data.avatar} alt=""
          style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', marginBottom: 6, border: `2px solid ${data.color || '#4a7c59'}` }} />
      ) : (
        <div style={{
          width: 48, height: 48, borderRadius: '50%', background: `${data.color || '#4a7c59'}22`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 6px', fontSize: 20,
        }}>👤</div>
      )}
      <div style={{
        fontWeight: 700, fontSize: 12, color: data.color || 'var(--primary, #4a7c59)',
        textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.2, marginBottom: 2,
      }}>
        {data.jabatan}
      </div>
      {data.nama && (
        <div style={{ fontSize: 12, color: '#555', lineHeight: 1.3 }}>{data.nama}</div>
      )}
      {data.count > 1 && (
        <div style={{
          marginTop: 4, fontSize: 10, background: `${data.color || '#4a7c59'}22`,
          color: data.color || '#4a7c59', borderRadius: 999, padding: '1px 8px',
          display: 'inline-block', fontWeight: 600,
        }}>{data.count} entri</div>
      )}
    </div>
  )
}
const nodeTypes = { orgCard: OrgCardNode }
const LEVEL_COLORS = ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7']

function BuilderCore({ jabatanGroups }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [saving, setSaving] = useState(false)
  const [loaded, setLoaded] = useState(false)
  
  const { toObject, setViewport } = useReactFlow()

  useEffect(() => {
    if (!jabatanGroups?.length) return
    async function init() {
      // 1. Get Live Data
      const liveDataMap = {}
      jabatanGroups.forEach((g, idx) => {
        const allPeople = g.entries?.filter(e => e.profiles) || []
        const entry = allPeople[0]
        liveDataMap[g.position] = {
          jabatan: g.position,
          nama: allPeople.length === 1 ? `${entry.profiles.first_name} ${entry.profiles.last_name}`.trim() : allPeople.length > 1 ? `${entry.profiles.first_name} ${entry.profiles.last_name} (+)`.trim() : null,
          count: allPeople.length,
          avatar: entry?.profiles?.avatar_url || null,
          color: LEVEL_COLORS[idx % LEVEL_COLORS.length]
        }
      })

      // 2. Fetch Saved Layout dari DB
      const { data } = await supabase.from('village_info').select('value').eq('key', 'org_chart_layout').single()
      let initialNodes = []
      let initialEdges = []

      if (data?.value) {
        try {
          const flow = JSON.parse(data.value)
          
          if (flow) {
            // Restore nodes tapi inject live data terbaru
            initialNodes = (flow.nodes || []).map(n => {
              if (liveDataMap[n.id]) {
                const updatedData = liveDataMap[n.id]
                delete liveDataMap[n.id] // Tandai sudah dipakai
                return { ...n, data: updatedData }
              }
              return n
            })
            initialEdges = flow.edges || []
            if (flow.viewport) setViewport(flow.viewport)
          }
        } catch(e) { console.error('Parse layout error', e) }
      }

      // 3. Tambahkan Jabatan BARU yang belum ada di canvas (spawn di posisi random/atas)
      Object.keys(liveDataMap).forEach((pos, i) => {
        initialNodes.push({
          id: pos,
          type: 'orgCard',
          position: { x: (i % 4) * 200, y: Math.floor(i / 4) * 160 },
          data: liveDataMap[pos]
        })
      })

      setNodes(initialNodes)
      setEdges(initialEdges)
      setLoaded(true)
    }
    init()
  }, [jabatanGroups])

  const onConnect = useCallback((params) => setEdges(eds => addEdge({
    ...params,
    markerEnd: { type: MarkerType.ArrowClosed, color: '#40916c' },
    style: { stroke: '#40916c', strokeWidth: 2 }
  }, eds)), [setEdges])

  async function saveLayout() {
    setSaving(true)
    const flow = toObject() // Ini sangat akurat (nodes + edges + posisi camera/zoom)
    const payload = JSON.stringify(flow)

    // Check if exists
    const { data: existing } = await supabase.from('village_info').select('id').eq('key', 'org_chart_layout').single()
    if (existing) {
      await supabase.from('village_info').update({ value: payload, type: 'json' }).eq('id', existing.id)
    } else {
      await supabase.from('village_info').insert({ key: 'org_chart_layout', value: payload, type: 'json' })
    }
    
    setSaving(false)
    alert('Bagan berhasil disimpan!')
  }

  function resetKoneksi() {
    if (confirm('Hapus semua panah?')) setEdges([])
  }

  if (!loaded && !jabatanGroups?.length) return <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Tambahkan jabatan terlebih dahulu</div>

  return (
    <div style={{ height: 600, position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitViewOptions={{ padding: 0.2 }}
        style={{ background: '#f8faf9', borderRadius: '0 0 12px 12px' }}
      >
        <Controls />
        <MiniMap nodeColor={n => n.data?.color || '#40916c'} />
        <Background color="#ccc" gap={20} />

        <Panel position="top-right">
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={resetKoneksi} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: '#fff', border: '1px solid #ccc', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Hapus Garis</button>
            <button onClick={saveLayout} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: '#2d6a4f', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
              <Save size={14} /> {saving ? 'Aman...' : 'Simpan Bagan Publik'}
            </button>
          </div>
        </Panel>

        <Panel position="bottom-left">
          <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#444', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info size={16} color="var(--primary)" />
            Tarik dot di pinggir card ke kotak lain untuk menyambung panah. Atur posisinya suka-suka!
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}

export default function OrgChartBuilder({ jabatanGroups }) {
  return (
    <ReactFlowProvider>
      <BuilderCore jabatanGroups={jabatanGroups} />
    </ReactFlowProvider>
  )
}
