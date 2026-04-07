import { useState, useEffect } from 'react'
import ReactFlow, { Background, Controls } from 'reactflow'
import 'reactflow/dist/style.css'
import { supabase } from '../lib/supabase'

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
        <img src={data.avatar} alt="" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', marginBottom: 6, border: `2px solid ${data.color || '#4a7c59'}` }} />
      ) : (
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${data.color || '#4a7c59'}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px', fontSize: 20 }}>👤</div>
      )}
      <div style={{ fontWeight: 700, fontSize: 12, color: data.color || 'var(--primary, #4a7c59)', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.2, marginBottom: 2 }}>{data.jabatan}</div>
      {data.nama && <div style={{ fontSize: 12, color: '#555', lineHeight: 1.3 }}>{data.nama}</div>}
      {data.count > 1 && <div style={{ marginTop: 4, fontSize: 10, background: `${data.color || '#4a7c59'}22`, color: data.color || '#4a7c59', borderRadius: 999, padding: '1px 8px', display: 'inline-block', fontWeight: 600 }}>{data.count} entri</div>}
    </div>
  )
}
const nodeTypes = { orgCard: OrgCardNode }

export default function OrgChartView({ jabatanGroups }) {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function load() {
      // Sama seperti di Admin Builder, kita siapkan Live Data Map
      const liveDataMap = {}
      if (jabatanGroups) {
        jabatanGroups.forEach((g, idx) => {
          const allPeople = g.entries?.filter(e => e.profiles) || []
          const entry = allPeople[0]
          liveDataMap[g.position] = {
            jabatan: g.position,
            nama: allPeople.length === 1 ? `${entry.profiles.first_name} ${entry.profiles.last_name}`.trim() : allPeople.length > 1 ? `${entry.profiles.first_name} ${entry.profiles.last_name} (+)`.trim() : null,
            count: allPeople.length,
            avatar: entry?.profiles?.avatar_url || null,
          }
        })
      }

      const { data } = await supabase.from('village_info').select('value').eq('key', 'org_chart_layout').single()
      
      if (data?.value) {
        try {
          const flow = JSON.parse(data.value)
          if (flow) {
            // Restore nodes -> timpa 'data' dari saved config dengan fresh data dari liveDataMap
            const restoredNodes = (flow.nodes || []).map(n => {
              if (liveDataMap[n.id]) {
                return { ...n, data: { ...n.data, ...liveDataMap[n.id] } }
              }
              return n
            })

            // Make sure everything is not draggable
            restoredNodes.forEach(n => {
              n.draggable = false
              n.selectable = false
            })

            setNodes(restoredNodes)
            setEdges(flow.edges || [])
            if (flow.viewport) setViewport(flow.viewport)
            setReady(true)
            return
          }
        } catch {}
      }
      setReady(true)
    }
    load()
  }, [jabatanGroups])

  if (!ready || !nodes.length) return <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>Bagan belum di-publish oleh admin.</div>

  return (
    <div style={{ height: 500, borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView={!viewport} // Fit view kalau no viewport, kalau ada viewport biarkan default
        defaultViewport={viewport}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={true}
        zoomOnScroll={true}
        proOptions={{ hideAttribution: true }}
        style={{ background: '#f8faf9' }}
      >
        <Controls showInteractive={false} />
        <Background color="#ccc" gap={20} />
      </ReactFlow>
    </div>
  )
}
