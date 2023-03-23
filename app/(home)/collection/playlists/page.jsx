"use client"

// Imports
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

// Hooks
import useSpotify from '@/hooks/useSpotify'

// Components
import * as UI from '../../../../components/index'
import LoadingPage from '../../loading'

const PlaylistPage = () => {
    const { data: session } = useSession();
    const spotifyApi = useSpotify();
    const [loading, setLoading] = useState(true);
    const [userPlaylist, setUserPlaylist] = useState(undefined);

    useEffect(() => {
        spotifyApi.getUserPlaylists(`${session.user.username}`, { limit: 50 })
            .then((data) => setUserPlaylist(data.body))
            .catch((err) => console.log('Something went wrong!', err))
            .finally(() => setLoading(false))
    }, [])

    if (!loading)
        return (
            <div className='flex flex-col bg-spotify-dark pt-4 px-9'>
                <p className='text-white font-bold text-2xl'>Playlists</p>
                <div className='flex flex-wrap'>
                    {userPlaylist.items.map((playlistInfo, index) => {
                        return (
                            <div className='w-1/6 mt-4' key={playlistInfo.id}>
                                <UI.Cards.PlaylistCard key={playlistInfo.id} playlistInfo={playlistInfo} />
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    else return <LoadingPage />
}

export default PlaylistPage