import { Tree, TreeNode } from 'react-organizational-chart'
import { GitBranch, MapPin, User } from 'lucide-react'

// Bangun tree dari baris individu (bukan grup)
function buildTree(rows) {
  const map = {}
  rows.forEach(r => { map[r.id] = { ...r, children: [] } })
  
  const roots = []
  rows.forEach(r => {
    // org_parent sekarang menyimpan ID row induk
    const parentId = r.org_parent
    if (parentId && map[parentId]) {
      map[parentId].children.push(map[r.id])
    } else {
      roots.push(map[r.id])
    }
  })
  return roots
}

const LEVEL_COLORS = ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2']

function SingleCard({ node, color }) {
  const { profiles: p, position, detail } = node
  return (
    <div style={{
      display: 'inline-block',
      background: 'var(--surface, #fff)',
      border: `2px solid ${color}`,
      borderRadius: '12px',
      padding: '12px 16px',
      minWidth: '160px',
      maxWidth: '220px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
      textAlign: 'center',
      position: 'relative'
    }}>
      {p?.avatar_url ? (
        <img src={p.avatar_url} alt=""
          style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover', marginBottom: '8px', border: `3px solid ${color}` }} />
      ) : (
        <div style={{
          width: 50, height: 50, borderRadius: '50%', background: `${color}15`, color: color,
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px'
        }}>
          <User size={24} />
        </div>
      )}
      <div style={{ fontWeight: 800, fontSize: '0.75rem', color: color, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
        {position} {detail && <span style={{ opacity: 0.8 }}>({detail})</span>}
      </div>
      {p && (
        <div style={{ fontSize: '0.85rem', color: '#444', fontWeight: 600 }}>
          {p.first_name} {p.last_name}
        </div>
      )}
      {!p && (
        <div style={{ fontSize: '0.75rem', color: '#999', fontStyle: 'italic' }}>Belum ditentukan</div>
      )}
    </div>
  )
}

// Rekursif Render Sub-tree
function renderChildren(nodes, level = 1) {
  return nodes.map(node => {
    const color = LEVEL_COLORS[level % LEVEL_COLORS.length]
    return (
      <TreeNode key={node.id} label={<SingleCard node={node} color={color} />}>
        {node.children?.length > 0 ? renderChildren(node.children, level + 1) : undefined}
      </TreeNode>
    )
  })
}

export default function SimpleOrgChart({ jabatanRaw }) {
  if (!jabatanRaw || jabatanRaw.length === 0) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>Belum ada data struktur organisasi.</div>
  }

  const roots = buildTree(jabatanRaw)

  return (
    <div style={{ 
      overflowX: 'auto', 
      padding: '3rem 1rem', 
      background: 'var(--bg-alt)', 
      borderRadius: 'var(--radius-lg)',
      textAlign: 'center'
    }}>
      {roots.map((rootNode, i) => {
        const color = LEVEL_COLORS[0]
        return (
          <div key={rootNode.id} style={{ marginBottom: i < roots.length - 1 ? '4rem' : 0 }}>
            <Tree lineWidth="3px" lineColor="#8bb19b" lineBorderRadius="6px" lineHeight="30px" nodePadding="6px"
              label={<SingleCard node={rootNode} color={color} />}>
              {rootNode.children?.length > 0 ? renderChildren(rootNode.children, 1) : undefined}
            </Tree>
          </div>
        )
      })}
    </div>
  )
}
