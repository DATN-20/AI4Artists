import DashboardNavbar from "@/components/layout/dashboard/dashboard-navbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <DashboardNavbar />
      {children}
    </>
  )
}
