// Imports

// Styles
import './globals.css'

// Components
import Providers from './providers'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html >
  )
}
