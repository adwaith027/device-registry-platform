import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider,Navigate } from 'react-router-dom'

import './styles/base.css'

import Home from './pages/Home.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ListingPage from './pages/ListingPage.jsx'
import Layout from './pages/Layout.jsx' 
import AddSerialNum from './pages/AddSerialNum.jsx'
import SignupPage from './pages/SignupPage.jsx'
import ProtectedRoute from './components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path:'/',
    element:<Navigate to="/login" replace />
  },
  {
    path: '/signup',
    element: <SignupPage />
  },  
  {
    path: '/login',
    element: <LoginPage />
  }, 
  {
    element:<ProtectedRoute/>,
    children:[
      {
        path: '/dashboard',
        element: <Layout />,             
        children: [
          {
            path: '',
            element: <Home />
          },
          {
            path: 'listing-page',
            element: <ListingPage />
          },
          {
            path: 'add-serialnum',
            element: <AddSerialNum />
          }
        ]
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)