'use client'
import React, { useCallback, useRef, useState, useEffect } from 'react'
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  ReactFlowProvider,
  Node,
  Edge,
  Connection,
  NodeTypes,
  ReactFlowInstance,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { saveAs } from 'file-saver'

const initialNodes: Node[] = [
  {
    id: 'input-1',
    type: 'inputNode',
    position: { x: 100, y: 100 },
    data: { label: 'InputNode' },
  },
  {
    id: 'model-1',
    type: 'modelNode',
    position: { x: 400, y: 100 },
    data: { label: 'ModelNode' },
  },
  {
    id: 'output-1',
    type: 'outputNode',
    position: { x: 700, y: 100 },
    data: { label: 'OutputNode' },
  },
]

const initialEdges: Edge[] = []

const LOCAL_STORAGE_KEY = 'mcp_flowchart'

function InputNode({ data }: { data: { label: string } }) {
  return (
    <div
      style={{
        padding: 10,
        background: '#e0f7fa',
        borderRadius: 8,
        border: '1px solid #00bcd4',
      }}
    >
      {data.label}
    </div>
  )
}
function ModelNode({ data }: { data: { label: string } }) {
  return (
    <div
      style={{
        padding: 10,
        background: '#fff9c4',
        borderRadius: 8,
        border: '1px solid #fbc02d',
      }}
    >
      {data.label}
    </div>
  )
}
function OutputNode({ data }: { data: { label: string } }) {
  return (
    <div
      style={{
        padding: 10,
        background: '#ffe0b2',
        borderRadius: 8,
        border: '1px solid #ff9800',
      }}
    >
      {data.label}
    </div>
  )
}

const nodeTypes: NodeTypes = {
  inputNode: InputNode,
  modelNode: ModelNode,
  outputNode: OutputNode,
}

const FlowChartInner = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null)

  // 載入 localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved) {
      try {
        const { nodes: savedNodes, edges: savedEdges } = JSON.parse(saved)
        if (savedNodes && savedEdges) {
          setNodes(savedNodes)
          setEdges(savedEdges)
        }
      } catch {}
    }
    // eslint-disable-next-line
  }, [])

  // 寫入 localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ nodes, edges }))
  }, [nodes, edges])

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  // 下載 MCP 設定
  const handleDownloadMCP = () => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject()
      const json = JSON.stringify(flow, null, 2)
      const blob = new Blob([json], { type: 'application/json' })
      saveAs(blob, 'mcp-config.json')
    }
  }

  return (
    <div
      style={{
        width: '100%',
        height: 500,
        background: '#fafafa',
        borderRadius: 12,
        boxShadow: '0 2px 8px #0001',
        margin: '24px 0',
      }}
      ref={reactFlowWrapper}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onInit={setReactFlowInstance}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background gap={16} />
      </ReactFlow>
      <button
        onClick={handleDownloadMCP}
        style={{
          marginTop: 16,
          padding: '8px 20px',
          borderRadius: 6,
          background: '#1976d2',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        下載 MCP 設定
      </button>
    </div>
  )
}

export default function FlowChart() {
  return (
    <ReactFlowProvider>
      <FlowChartInner />
    </ReactFlowProvider>
  )
}
