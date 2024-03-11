import GenerateNavbar from "@/components/layout/generate/GenerateNavbar"

export default function GenerateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <GenerateNavbar />
      {children}
    </>
  )
}
