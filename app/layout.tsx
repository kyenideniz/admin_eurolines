import './globals.css'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ModalProvider } from '@/providers/modal-provider'
import { ToasterProvider } from '@/providers/toast-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import { Metadata } from 'next'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Eurolines",
  description: "Admin Panel for BusEurolines",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{
      elements: {
        footer: "hidden",
      },
    }}> 
    <html lang="en">
      <body className={inter.className && "w-full h-full"}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ToasterProvider />
          <ModalProvider />
            {children}
        </ThemeProvider>
        </body>
    </html>
  </ClerkProvider>
  );
}
