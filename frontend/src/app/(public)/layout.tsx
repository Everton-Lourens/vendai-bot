import { Roboto } from 'next/font/google'
import { ReactNode } from 'react'

import '@/styles/public-layout.scss'

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={roboto.className}>
        <div className="main-container">
          <section className="forms-container">{children}</section>
          <section className="infos-container">images</section>
        </div>
      </body>
    </html>
  )
}
