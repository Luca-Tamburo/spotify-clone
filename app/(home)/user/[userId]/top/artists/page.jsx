"use client"

// Imports
import React, { useState, useEffect } from 'react'

// Hooks
import useSpotify from '@/hooks/useSpotify';

// Components
import Loading from '@/app/(home)/loading';
import * as UI from '../../../../../../components/index'

const TopArtistsPage = () => {
    const spotifyApi = useSpotify();
    const [userTopArtists, setUserTopArtists] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        spotifyApi.getMyTopArtists({ limit: 10 })
            .then((data) => {
                setUserTopArtists(data.body.items);
            }).catch((err) => {
                console.log('Something went wrong!', err);
            })
            .finally(() => setLoading(false));
    }, [])

    if (!loading)
        return (
            <div className='flex flex-col bg-spotify-dark pt-6 px-4'>
                <p className='text-white font-bold text-2xl ml-1'>Top artists this month</p>
                <p className='text-spotify-light-gray text-sm font-semibold mt-1 ml-2'>Only visible to you</p>
                <div className='flex flex-wrap mt-4'>
                    {userTopArtists.map((artistInfo, index) => {
                        return (
                            <div className='w-1/6 px-2 mb-7' key={artistInfo.id}>
                                <UI.Cards.ArtistCard key={artistInfo.id} artistInfo={artistInfo} />
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    else return <Loading />
}


export default TopArtistsPage