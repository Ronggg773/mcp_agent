import FlowChart from './FlowChart'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">流程圖編輯器（React Flow）</h1>
      <FlowChart />
    </main>
  )
}
