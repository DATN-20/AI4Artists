import { Footer, Navbar, AuthProvider } from '@/components/layout';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AuthProvider>
      <Navbar />
      {children}
      </AuthProvider>

    </>
  );
}
