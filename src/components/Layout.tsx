// src/components/Layout.tsx
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Nav from './Nav'
import './css/layout.css'

export default function Layout() {
  return (
    <div className="layout">
      <Nav />
      <div className="main-section">
        <Header />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
