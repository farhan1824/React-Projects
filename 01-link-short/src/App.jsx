import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import LandingPage from './pages/LandingPage'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Link from './pages/Link'
import RedirectPage from './pages/RedirectPage'
import { UrlProvider } from './Context'


const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [

      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: '/auth',
        element: <Auth />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/link/:id',
        element: <Link />
      },

      {
        path: '/:id',
        element: <RedirectPage />
      },


    ]
  }
])
const App = () => {

  return (
    <div className='bg-black min-h-screen'>
      <UrlProvider><RouterProvider router={router} /></UrlProvider>

    </div>
  )
}

export default App