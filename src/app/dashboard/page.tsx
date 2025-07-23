import { Suspense } from "react"
import DashboardView from "../../../views/DashboardView"

export default function Dashboard() {
  return (
    <Suspense fallback={null}>
      <DashboardView />
    </Suspense>
  )
}
