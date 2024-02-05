import { Footer, Navbar, AuthProvider } from "@/components/layout"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <AuthProvider>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          {children}
        </div>
        <Footer />
      </AuthProvider>
    </>
  )
}
