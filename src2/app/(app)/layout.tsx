import type { Metadata } from 'next'
import '@/styles/global.scss'
import { Header } from '@/components/layout/Header'
import { AlertContextComponent } from '@/contexts/alertContext'

export const metadata: Metadata = {
  title: 'JChat',
  description:
    'Chat Bot com funcionalidade de envio de mensagens em massa através do whatsapp.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br">
      <body>
        <AlertContextComponent>
          <Header />

          {children}
        </AlertContextComponent>
      </body>
    </html>
  )
}
