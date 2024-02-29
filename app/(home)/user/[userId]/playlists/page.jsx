"use client"

// Imports
import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation';

// Hooks
import useSpotify from '@/hooks/useSpotify';

// Components
import Loading from '@/app/(home)/loading';
import * as UI from '../../../../../components/index'

const UserPublicPlaylistPage = () => {
    const spotifyApi = useSpotify();
    const pathname = usePathname();

    const [userPublicPlaylist, setUserPublicPlaylist] = useState(undefined);
    const [loading, setLoading] = useState(true);

    const userId = pathname.split("/")[2]

    useEffect(() => {
        spotifyApi.getUserPlaylists(userId, { limit: 50 })
            .then((data) => {
                setUserPublicPlaylist(data.body.items);
            }).catch((err) => {
                console.log('Something went wrong!', err);
            })
            .finally(() => setLoading(false));
    }, [])

    if (!loading)
        return (
            <div className='flex flex-col bg-spotify-dark pt-6 px-4'>
                <p className='text-white font-bold text-2xl ml-1'>Public Playlists</p>
                <div className='flex flex-wrap mt-4'>
                    {userPublicPlaylist.map((playlistInfo, index) => {
                        return (
                            <div className='w-1/6 px-2 mb-7' key={playlistInfo.id}>
                                <UI.Cards.PlaylistCard key={playlistInfo.id} playlistInfo={playlistInfo} />
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    else return <Loading />
}


export default UserPublicPlaylistPage