// Imports

// Styles
import './globals.css'

// Components
import * as MainComponents from "./components/index"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className='flex flew-row'>
        <MainComponents.Sidebar />
        <div className='w-10/12'>
          <MainComponents.Navbar />
          {children}
          <MainComponents.Footer />
        </div>
      </body>
    </html>
  )
}
