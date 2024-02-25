import { Footer, Navbar } from "@/components/layout"
import { StoreProvider } from "../../store/StoreProvider"
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        {children}
      </div>
      <Footer />
    </>
  )
}
