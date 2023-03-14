// Imports

// Styles
import './globals.css'

// Components
import Providers from './providers'

// Context
import { DataContextProvider } from '@/contexts/DataContext'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <DataContextProvider>
          <Providers>
            {children}
          </Providers>
        </DataContextProvider>
      </body>
    </html >
  )
}
