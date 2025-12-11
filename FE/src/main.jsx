import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './styles/base.css'

import Home from './pages/Home.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ListingPage from './pages/ListingPage.jsx'
import AddProduct from './pages/AddProduct.jsx'
import Layout from './pages/Layout.jsx' 
import AddSerialNum from './pages/AddSerialNum.jsx'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },  
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
      // {
      //   path: 'add-product',
      //   element: <AddProduct />
      // },
      {
        path: 'add-serialnum',
        element: <AddSerialNum />
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)