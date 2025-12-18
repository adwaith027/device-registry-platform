import '../styles/Sidebar.css'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import api, { BASE_URL } from '../assets/js/axiosConfig';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const closeSidebar = () => {
    setIsOpen(false)
  }

  const navigate=useNavigate();
  const handleLogout = async () => {
    try {
      await api.post(`${BASE_URL}/logout/`)
      localStorage.removeItem('user')
      closeSidebar()
      navigate('/login')
    } catch (err) {
      console.error('Logout error:', err)
      localStorage.removeItem('user')
      closeSidebar()
      navigate('/login')
    }
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="sidebar-toggle"
        onClick={toggleSidebar}
        aria-label="Toggle navigation menu"
      >
        <span className="sidebar-toggle__icon">☰</span>
      </button>

      {/* Mobile Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'sidebar-overlay--active' : ''}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <h2 className="sidebar__title">Softland India Ltd</h2>
        </div>

        <nav className="sidebar__nav">
          <ul className="sidebar__menu">
            <div className="sidebar__menu-top">
              <li className="sidebar__menu-item">
                <NavLink
                  to="/dashboard"
                  end
                  className={({ isActive }) => 
                    `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                  }
                  onClick={closeSidebar}
                >
                  Home
                </NavLink>
              </li>
                          
              <li className="sidebar__menu-item">
                <NavLink
                  to="/dashboard/add-serialnum"
                  className={({ isActive }) => 
                    `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                  }
                  onClick={closeSidebar}
                >
                  Add Serial Numbers
                </NavLink>
              </li>

              <li className="sidebar__menu-item">
                <NavLink
                  to="/dashboard/listing-page"
                  className={({ isActive }) => 
                    `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                  }
                  onClick={closeSidebar}
                >
                  Map Devices
                </NavLink>
              </li>

            </div>

            <div className="sidebar__menu-bottom">
              <li className="sidebar__menu-item">
                <button
                  onClick={handleLogout}
                  className="sidebar__link sidebar__link--logout">
                  Logout
                </button>
              </li>
            </div>
          </ul>
        </nav>
      </aside>
    </>
  )
}