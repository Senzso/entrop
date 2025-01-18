import Terminal from './components/terminal'
import Background from './components/background'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Background />
      <Terminal />
    </main>
  )
}

