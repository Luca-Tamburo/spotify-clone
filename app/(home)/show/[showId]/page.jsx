"use client"

// Imports
import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
const axios = require('axios');
import { useSession } from "next-auth/react"
import copy from 'copy-to-clipboard';

// Hooks
import useSpotify from '@/hooks/useSpotify'
import useNotification from '@/hooks/useNotification'

// Components
import LoadingPage from '../../loading'
import * as UI from '../../../../components/index'

// Styles
import { MdHideImage } from 'react-icons/md'
import { TbShare2 } from 'react-icons/tb'

const ShowPage = () => {
    const { data: session } = useSession();
    const spotifyApi = useSpotify();
    const notify = useNotification();
    const pathname = usePathname();

    const showId = pathname.split("/")[2]

    const [pageInfo, setPageInfo] = useState(undefined)
    const [isFollowed, setIsFollowed] = useState(true);
    const [likedEpisodes, setLikedEpisodes] = useState(undefined)
    const [updateLikedEpisodes, setUpdateLikedEpisodes] = useState(true);
    const [loading, setLoading] = useState(true);

    const handleAddShowFollow = (showId) => {
        spotifyApi.addToMySavedShows(showId)
            .then(() => {
                setIsFollowed(true)
                notify.success("Added to your Podcasts & Shows")
            }).catch((err) => {
                notify.error("Error! Try again")
                console.log('Something went wrong!', err);
            })
    }

    const handleRemoveShowFollow = (showId) => {
        spotifyApi.removeFromMySavedShows(showId)
            .then(() => {
                setIsFollowed(false)
                notify.success("Removed from your Podcasts & Shows")
            }).catch((err) => {
                notify.error("Error! Try again")
                console.log('Something went wrong!', err);
            })
    }

    const handleShareLink = () => {
        copy(`https://spotify-clone-six-beta.vercel.app/show/${showId}`);
        notify.success("Link copied to clipboard")
    }

    useEffect(() => {
        const handleLoading = async () => {
            try {
                const shows = await spotifyApi.getShow(showId)
                const isFollowing = await spotifyApi.containsMySavedShows([showId])

                isFollowing.body.forEach(function (isFollowing) {
                    setIsFollowed(isFollowing)
                });

                const response = await axios.get('https://api.spotify.com/v1/me/episodes?limit=50', {
                    headers: {
                        'Authorization': `Bearer ${session.user.accessToken}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                const likedEpisodesId = response.data.items.map(it => [it.episode.id])

                const pageData = {
                    showInfo: shows.body
                }

                setLoading(false)
                setPageInfo(pageData)
                setLikedEpisodes(likedEpisodesId)
            } catch (err) {
                console.log('Something went wrong!', err)
            }
        }
        handleLoading();
    }, [updateLikedEpisodes])

    if (!loading)
        return (
            <div className='flex flex-col bg-spotify-dark p-7'>
                {/* Show Header Section */}
                <div className='flex'>
                    {pageInfo.showInfo.images.length === 0 ? <MdHideImage size={150} className='pl-7' /> :
                        <Image
                            src={pageInfo.showInfo.images[0].url}
                            alt='Show Image'
                            width={640}
                            height={640}
                            className='h-56 w-56 rounded-lg'
                        />
                    }
                    <div className='flex flex-col text-white font-bold ml-4'>
                        <p className='mt-10'>Podcast</p>
                        <p className='text-8xl'>{pageInfo.showInfo.name}</p>
                        <p className='mt-8 text-xl'>{pageInfo.showInfo.publisher}</p>
                    </div>
                </div>
                {/* Show Episodes Section */}
                <div className='flex align-middle mt-6 ml-3'>
                    {isFollowed ?
                        <button onClick={() => handleRemoveShowFollow([showId])} className='rounded-lg border border-white '>
                            <p className='text-white font-bold py-2 px-4'>FOLLOWING</p>
                        </button>
                        :
                        <button onClick={() => handleAddShowFollow([showId])} className='rounded-lg border border-white'>
                            <p className='text-white font-bold py-2 px-4'>FOLLOW</p>
                        </button>
                    }
                    <button onClick={handleShareLink} className='ml-3'>
                        <TbShare2 size={40} className='text-white' />
                    </button>
                </div>
                <div className='flex mt-4'>
                    <div className='w-8/12'>
                        <p className='text-white text-2xl font-bold ml-3 my-4'>All episodes</p>
                        {pageInfo.showInfo.episodes.items.map((episodeInfo, index) => {
                            return (
                                // TODO: Fixare il like sui singoli episodi
                                <UI.EpisodeList key={episodeInfo.id} episodeInfo={episodeInfo} likedEpisodes={likedEpisodes[index]} setUpdateLikedEpisodes={setUpdateLikedEpisodes} updateLikedEpisodes={updateLikedEpisodes} />
                            )
                        })}
                    </div>
                    <div className='w-4/12 flex flex-col mt-4 ml-8'>
                        <p className='text-white text-xl font-bold'>About</p>
                        <p className='text-spotify-light-gray font-semibold mt-4'>{pageInfo.showInfo.description}</p>
                    </div>
                </div>
                <ToastContainer />
            </div>
        )
    else return <LoadingPage />
}

export default ShowPage