import DashboardNavbar from "@/components/layout/dashboard/DashboardNavbar"

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
