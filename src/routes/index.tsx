import { createFileRoute } from '@tanstack/react-router'
import TitleHeader from '@/components/TitleHeader'
import ContentBody from '@/components/ContentBody'

export const Route = createFileRoute('/')({ component: App })

function App() {

  return (
    <div className="min-h-screen
                    lg:bg-[url(/background.png)] bg-[url(/mobile-background.png)] bg-cover">
      <div className="min-h-screen bg-pink-400/40 p-4">
        <TitleHeader />
        <ContentBody />
      </div>
    </div>
  )
}
