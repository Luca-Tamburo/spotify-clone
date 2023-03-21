"use client"

// Imports
import Link from "next/link"

import React, { useState, useEffect, useContext } from "react"
import { useSession } from 'next-auth/react';

// Hooks
import useSpotify from '@/hooks/useSpotify';

// Components
import Loading from '@/app/(home)/loading';
import * as UI from '../components/index'

// Context
import { DataContext } from "@/contexts/DataContext";

const Sidebar = () => {
    const { data: session } = useSession();
    const spotifyApi = useSpotify();
    const [userPlaylists, setUserPlaylists] = useState({});
    const [loading, setLoading] = useState(true);
    const [updateSidebar, setUpdateSidebar] = useContext(DataContext)

    useEffect(() => {
        spotifyApi.getUserPlaylists(`${session.user.username}`)
            .then((data) => {
                setUserPlaylists(data.body.items);
            }).catch((err) => {
                console.log('Something went wrong!', err);
            })
            .finally(() => setLoading(false));
    }, [updateSidebar]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!loading)
        return (
            <div className="bg-black text-spotify-light-gray w-2/12 h-screen pl-6 fixed">
                {/* First Section */}
                <UI.SidebarLink />
                <hr className="w-10/12 mt-4" />
                {/* Second Section */}
                <div className="mt-4">
                    {userPlaylists.map((playlist, index) => {
                        return (
                            <Link key={playlist.id} href={`/playlist/${playlist.id}`}>
                                <p className="text-sm truncate font-semibold mb-2 mr-14 hover:text-white">{playlist.name}</p>
                            </Link>
                        )
                    })}
                </div>
            </div >
        )
    else return <Loading />
}

export default Sidebar