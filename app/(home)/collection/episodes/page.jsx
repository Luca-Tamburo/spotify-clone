"use client"

// Imports
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useSession } from "next-auth/react"

// Hooks
import useSpotify from '@/hooks/useSpotify'

// Components
import LoadingPage from '../../loading'
import * as UI from '../../../../components/index'

// Styles
import { BsFillPlayCircleFill, BsFillBookmarkFill } from 'react-icons/bs'
import { MdHideImage } from 'react-icons/md'
import { TbCirclePlus } from 'react-icons/tb'

const EpisodesPage = () => {
    const axios = require('axios');
    const { data: session } = useSession();
    const spotify = useSpotify();
    const route = useRouter();

    const [pageInfo, setPageInfo] = useState(undefined)
    const [likedEpisodes, setLikedEpisodes] = useState(undefined)
    const [updateLikedEpisodes, setUpdateLikedEpisodes] = useState(true);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const handleLoading = async () => {
            try {
                const userInfo = await spotify.getMe();

                const response = await axios.get('https://api.spotify.com/v1/me/episodes', {
                    headers: {
                        'Authorization': `Bearer ${session.user.accessToken}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                const likedEpisodesId = response.data.items.map(it => [it.episode.id])

                const infos = {
                    userInfo: userInfo.body,
                    episodesInfo: response.data.items,
                }

                setPageInfo(infos)
                setLikedEpisodes(likedEpisodesId)
                setLoading(false)

            } catch (err) {
                console.log('Something went wrong!', err);
            }
        }
        handleLoading()
    }, [updateLikedEpisodes])

    if (!loading)
        return (
            <div className='flex flex-col'>
                {/* Liked Song Info Section */}
                <div className='flex bg-gradient-to-t from-[#03352B] to-[#065E4C] p-6'>
                    <div className='flex justify-center items-center rounded drop-shadow-2xl bg-[#056952] w-56 h-56'>
                        <BsFillBookmarkFill size={70} className="text-spotify-green" />
                    </div>
                    <div className='flex flex-col text-white font-bold mt-10 ml-5'>
                        <p>Playlist</p>
                        <p className='text-8xl mt-4 mb-5'>Your Episodes</p>
                        <div className='flex'>
                            {pageInfo.userInfo.images[0].url ?
                                <Image
                                    src={pageInfo.userInfo.images[0].url}
                                    alt="User Profile Image"
                                    width={25}
                                    height={25}
                                    className="inline-block rounded-full"
                                /> : <MdHideImage size={25} className="mt-4" />
                            }
                            <Link href={`/user/${pageInfo.userInfo.id}`}>
                                <span className='text-white text-sm font-bold hover:underline mx-2'>{pageInfo.userInfo.display_name}</span>
                            </Link>
                            {pageInfo.episodesInfo.length !== 0 && <p className='font-semibold'>&bull; {pageInfo.episodesInfo.length} episodes</p>}
                        </div>
                    </div>
                </div>
                {/* Liked Song List Section */}
                {pageInfo.episodesInfo.length !== 0 ?
                    <div className='flex flex-col bg-gradient-to-b from-[#032821] to-spotify-dark'>
                        <button className='text-spotify-green rounded-full'>
                            <BsFillPlayCircleFill size={60} className="mt-6 ml-8 hover:scale-105" />
                        </button>
                        <div className='mt-10 ml-7 w-10/12'>
                            {pageInfo.episodesInfo.map((episodeInfo, index) => {
                                return (
                                    <UI.EpisodeList key={episodeInfo.id} episodeInfo={episodeInfo.episode} likedEpisodes={likedEpisodes[index]} setUpdateLikedEpisodes={setUpdateLikedEpisodes} updateLikedEpisodes={updateLikedEpisodes} />
                                )
                            })}
                        </div>
                    </div>
                    :
                    <div className='flex flex-col justify-center items-center bg-gradient-to-b from-[#032720] to-spotify-dark text-white'>
                        <TbCirclePlus size={70} className='mt-10' />
                        <p className='text-3xl font-bold my-8'>Add to Your Episodes</p>
                        <p className='font-semibold mb-8'>Save episodes to this playlist by tapping the plus icon.</p>
                        {/* TODO: Capire se si può reindirizzare a /genre/podcasts-web */}
                        <button className='bg-white hover:scale-105 rounded-full' onClick={() => { route.push('/search') }}>
                            <p className='text-black font-bold py-3 px-8'>Find podcasts</p>
                        </button>
                    </div>
                }
                <ToastContainer />
            </div>
        )
    else return <LoadingPage />
}

export default EpisodesPage