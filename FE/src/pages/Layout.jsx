import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import '../styles/Layout.css';

export default function Layout() {
  return (
    <div className="layout">
      <Sidebar />
      
      <main className="layout__content">
        <Outlet />
      </main>
    </div>
  )
}