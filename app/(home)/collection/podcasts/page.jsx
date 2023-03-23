"use client"

// Imports
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

// Hooks
import useSpotify from '@/hooks/useSpotify'

// Components
import * as UI from '../../../../components/index'
import LoadingPage from '../../loading'

const PodcastPage = () => {
    const { data: session } = useSession();
    const spotifyApi = useSpotify();
    const [loading, setLoading] = useState(true);
    const [userPodcast, setUserPodcast] = useState(undefined);

    useEffect(() => {
        spotifyApi.getMySavedShows({ limit: 50 })
            .then((data) => setUserPodcast(data.body))
            .catch((err) => console.log('Something went wrong!', err))
            .finally(() => setLoading(false))
    }, [])

    console.log(userPodcast);
    if (!loading)
        return (
            <div className='flex flex-col bg-spotify-dark pt-4 px-9'>
                <p className='text-white font-bold text-2xl'>Podcasts</p>
                <div className='flex flex-wrap'>
                    {userPodcast.items.map((podcastInfo, index) => {
                        return (
                            <div className='w-1/6 mt-4' key={podcastInfo.id}>
                                <UI.Cards.PodcastCard key={podcastInfo.id} podcastInfo={podcastInfo} />
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    else return <LoadingPage />
}

export default PodcastPage