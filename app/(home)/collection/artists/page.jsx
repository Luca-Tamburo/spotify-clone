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
import { FaUserPlus } from 'react-icons/fa'

const ArtistPage = () => {
    const spotifyApi = useSpotify();
    const route = useRouter();
    const [loading, setLoading] = useState(true);
    const [userArtists, setUserArtists] = useState(undefined);

    useEffect(() => {
        spotifyApi.getFollowedArtists({ limit: 50 })
            .then((data) => setUserArtists(data.body.artists))
            .catch((err) => console.log('Something went wrong!', err))
            .finally(() => setLoading(false))
    }, [])

    if (!loading)
        return (
            <>
                {userArtists.items.length !== 0 ?
                    <div className='flex flex-col bg-spotify-dark pt-4 px-9 h-screen'>
                        <p className='text-white font-bold text-2xl'>Artists</p>
                        <div className='flex flex-wrap'>
                            {userArtists.items.map((artistInfo, index) => {
                                return (
                                    <div className='w-1/6 mt-4' key={artistInfo.id}>
                                        <UI.Cards.ArtistCard key={artistInfo.id} artistInfo={artistInfo} />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    :
                    <div className='flex flex-col justify-center items-center bg-spotify-dark text-white h-full'>
                        <FaUserPlus size={70} className='' />
                        <p className='text-3xl font-bold my-8'>Follow your first artist</p>
                        <p className='font-semibold mb-10'>Follow artists you like by tapping the follow button.</p>
                        <button className='bg-white hover:scale-105 rounded-full' onClick={() => { route.push('/search') }}>
                            <p className='text-black font-bold py-3 px-8'>Find artists</p>
                        </button>
                    </div>
                }
            </>
        )
    else return <LoadingPage />
}

export default ArtistPage