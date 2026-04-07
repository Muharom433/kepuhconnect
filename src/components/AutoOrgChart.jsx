import { useEffect, useCallback } from 'react'
import ReactFlow, { Background, Controls, MarkerType, useNodesState, useEdgesState } from 'reactflow'
import 'reactflow/dist/style.css'
import dagre from 'dagre'

const LEVEL_COLORS = ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2']

function OrgCardNode({ data }) {
  return (
    <div style={{
      background: '#fff',
      border: `2px solid ${data.color || '#40916c'}`,
      borderRadius: 10,
      padding: '12px 18px',
      minWidth: 160,
      maxWidth: 220,
      boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
      textAlign: 'center',
      fontFamily: 'inherit',
    }}>
      {data.avatar ? (
        <img src={data.avatar} alt=""
          style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', marginBottom: 8, border: `2px solid ${data.color}` }} />
      ) : (
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: `${data.color || '#40916c'}22`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 8px', fontSize: 22,
        }}>👤</div>
      )}
      <div style={{
        fontWeight: 800, fontSize: 11, color: data.color || '#40916c',
        textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3,
      }}>
        {data.jabatan}
      </div>
      {data.nama && (
        <div style={{ fontSize: 12, color: '#444', fontWeight: 600 }}>{data.nama}</div>
      )}
      {data.count > 1 && (
        <div style={{
          marginTop: 5, fontSize: 10,
          background: `${data.color || '#40916c'}18`,
          color: data.color || '#40916c',
          borderRadius: 999, padding: '2px 8px', display: 'inline-block', fontWeight: 700,
        }}>
          {data.count} orang
        </div>
      )}
    </div>
  )
}

const nodeTypes = { orgCard: OrgCardNode }

/* Layout otomatis dengan Dagre */
const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))

  const isHorizontal = direction === 'LR'
  dagreGraph.setGraph({ rankdir: direction, nodesep: 60, ranksep: 100 })

  nodes.forEach((node) => {
    // Ukuran perkiraan node card
    dagreGraph.setNode(node.id, { width: 180, height: 160 })
  })

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    node.targetPosition = isHorizontal ? 'left' : 'top'
    node.sourcePosition = isHorizontal ? 'right' : 'bottom'
    // Geser ke top-left karena Dagre menghitung center point
    node.position = {
      x: nodeWithPosition.x - 90,
      y: nodeWithPosition.y - 80,
    }
    return node
  })

  return { nodes, edges }
}

export default function AutoOrgChart({ jabatanGroups, editable = false }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  useEffect(() => {
    if (!jabatanGroups?.length) return

    // Hitung level untuk pewarnaan
    const map = {}
    jabatanGroups.forEach(g => { map[g.position] = g })
    function getLevel(pos, visited = new Set()) {
      if (!pos || visited.has(pos)) return 0
      visited.add(pos)
      const g = map[pos]
      if (!g?.org_parent || !map[g.org_parent]) return 0
      return 1 + getLevel(g.org_parent, visited)
    }

    // Bangun Node
    const initialNodes = jabatanGroups.map((g) => {
      const allPeople = g.entries?.filter(e => e.profiles) || []
      const entry = allPeople[0]
      const lvl = getLevel(g.position)
      
      return {
        id: g.position,
        type: 'orgCard',
        data: {
          jabatan: g.position,
          nama: allPeople.length === 1 
            ? `${entry.profiles.first_name} ${entry.profiles.last_name}`.trim()
            : allPeople.length > 1
              ? `${entry.profiles.first_name} ${entry.profiles.last_name}`.trim()
              : null,
          count: allPeople.length,
          avatar: entry?.profiles?.avatar_url || null,
          color: LEVEL_COLORS[lvl % LEVEL_COLORS.length],
        },
        position: { x: 0, y: 0 },
        draggable: editable,
        selectable: editable,
      }
    })

    // Bangun Koneksi (Edges)
    const initialEdges = jabatanGroups
      .filter(g => g.org_parent && jabatanGroups.find(x => x.position === g.org_parent))
      .map(g => ({
        id: `${g.org_parent}-${g.position}`,
        source: g.org_parent,
        target: g.position,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#40916c' },
        style: { stroke: '#40916c', strokeWidth: 2 },
        type: 'smoothstep',
      }))

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges, 'TB')

    setNodes(layoutedNodes)
    setEdges(layoutedEdges)
  }, [jabatanGroups, editable])

  if (!jabatanGroups?.length) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
        Belum ada data bagan
      </div>
    )
  }

  return (
    <div style={{ height: editable ? 520 : 480, overflow: 'hidden', position: 'relative', background: '#f0f7f4' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={editable}
        nodesConnectable={false}
        elementsSelectable={editable}
        panOnDrag={true}
        zoomOnScroll={true}
        proOptions={{ hideAttribution: true }}
      >
        <Controls showInteractive={false} />
        <Background color="#c8e6d0" gap={24} />
      </ReactFlow>
    </div>
  )
}
