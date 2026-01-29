import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">iv_comply</h1>
        <div className="flex gap-2">
          <Card />
        </div>
      </div>
    </main>
  )
}