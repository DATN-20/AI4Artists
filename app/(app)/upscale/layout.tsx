import DashboardNavbar from "@/components/layout/dashboard/DashboardNavbar"

export default function UpscaleLayout({
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
