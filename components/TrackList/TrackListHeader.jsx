"use client"
// Imports
import React from 'react'
import { usePathname } from 'next/navigation'

// Styles
import { BsClockHistory } from 'react-icons/bs'

const TrackListHeader = () => {
    const pathname = usePathname();

    return (
        <>
            <thead className='text-spotify-light-gray'>
                <tr>
                    <th className='text-left pl-6 text-xl'>#</th>
                    <th className='text-left'>Title</th>
                    {!pathname.includes("album") && <th className='text-left'>Album</th>}
                    <th className='text-left'></th>
                    <th className='text-left'>
                        <BsClockHistory />
                    </th>
                </tr>
            </thead>
        </>
    )
}

export default TrackListHeader