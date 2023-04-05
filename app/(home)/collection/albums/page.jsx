"use client"

// Imports
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Hooks
import useSpotify from '@/hooks/useSpotify'

// Components
import * as UI from '../../../../components/index'
import LoadingPage from '../../loading'

// Styles
import { BiAlbum } from 'react-icons/bi'

const AlbumPage = () => {
    const spotifyApi = useSpotify();
    const route = useRouter();
    const [loading, setLoading] = useState(true);
    const [userAlbums, setUserAlbums] = useState(undefined);

    useEffect(() => {
        spotifyApi.getMySavedAlbums({ limit: 50 })
            .then((data) => setUserAlbums(data.body.items))
            .catch((err) => console.log('Something went wrong!', err))
            .finally(() => setLoading(false))
    }, [])


    if (!loading)
        return (
            <>
                {userAlbums.length !== 0 ?
                    <div className='flex flex-col bg-spotify-dark pt-4 px-9 h-screen'>
                        <p className='text-white font-bold text-2xl'>Artists</p>
                        <div className='flex flex-wrap'>
                            {userAlbums.map((albumInfo, index) => {
                                return (
                                    <div className='w-1/6 mt-4' key={albumInfo.id}>
                                        <UI.Cards.AlbumCard key={albumInfo.id} albumInfo={albumInfo.album} />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    :
                    <div className='flex flex-col justify-center items-center bg-spotify-dark text-white h-full'>
                        <BiAlbum size={70} />
                        <p className='text-3xl font-bold my-8'>Follow your first album</p>
                        <p className='font-semibold mb-10'>Save albums by tapping the heart icon.</p>
                        <button className='bg-white hover:scale-105 rounded-full' onClick={() => { route.push('/search') }}>
                            <p className='text-black font-bold py-3 px-8'>Find albums</p>
                        </button>
                    </div>
                }
            </>
        )
    else return <LoadingPage />
}

export default AlbumPage