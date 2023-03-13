"use client"

// Imports
import React from 'react'
import { useSession } from "next-auth/react"

// Components
import * as MainComponents from "../../components/index"
import LoadingPage from './loading'

const HomeLayout = ({ children }) => {
    const { data: session, status } = useSession();

    if (status !== "loading")
        return (
            <>
                {status === 'unauthenticated' ? <MainComponents.UnLoggedIn /> :
                    <div className="flex" >
                        <MainComponents.Sidebar />
                        <div className='w-10/12 ml-auto'>
                            <MainComponents.Navbar />
                            {children}
                            <MainComponents.Footer />
                        </div>
                    </div>
                }
            </>
        )
    else return <LoadingPage />
}

export default HomeLayout