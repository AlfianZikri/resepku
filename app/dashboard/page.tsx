import { Suspense } from "react"
import Header from "@/components/header"
import DashboardContent from "@/components/dashboard-content"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Suspense fallback={null}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}
