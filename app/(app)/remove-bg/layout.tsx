import DashboardNavbar from "@/components/layout/dashboard/DashboardNavbar"

export default function RemoveBgLayout({
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
