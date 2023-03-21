"use client"

// Imports
import React, { useState, useEffect } from 'react'

// Hooks
import useSpotify from '@/hooks/useSpotify';

// Components
import LoadingPage from '@/app/(home)/loading';
import * as UI from '../../../../../../components/index'

// Styles
import { BsClockHistory } from 'react-icons/bs'


const TopTracksPage = () => {
  const spotifyApi = useSpotify();
  const [userTopTracks, setUserTopTracks] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    spotifyApi.getMyTopTracks({ limit: 50 })
      .then((data) => {
        setUserTopTracks(data.body.items)
      }).catch((err) => {
        console.log('Something went wrong!', err);
      })
      .finally(() => setLoading(false));
  }, [])

  if (!loading)
    return (
      <div className='flex flex-col bg-spotify-dark pt-6 px-4' >
        <p className='text-white font-bold text-2xl'>Top tracks this month</p>
        <p className='text-spotify-light-gray font-semibold mt-2'>Only visible to you</p>
        <table className='table-auto border-separate border-spacing-y-3 mt-6'>
          <thead className='text-spotify-light-gray'>
            <tr>
              <th className='text-left pl-6 text-xl'>#</th>
              <th className='text-left'>Title</th>
              <th className='text-left'>Album</th>
              <th className='text-left'>
                <BsClockHistory />
              </th>
            </tr>
          </thead>
          {userTopTracks.map((trackInfo, index) => {
            return (
              <UI.TracksList key={trackInfo.id} trackInfo={trackInfo} index={index} />
            )
          })}
        </table>
      </div >
    )
  else return <LoadingPage />
}

export default TopTracksPage