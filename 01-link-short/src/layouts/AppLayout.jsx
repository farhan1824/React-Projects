import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

function AppLayout() {
    return (
        <>
            <Header />

            <main>
                <Outlet />
            </main>


        </>
    )
}

export default AppLayout
