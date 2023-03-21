"use client"

// Imports
import React, { useState, useEffect, useContext } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

// Context
import { DataContext } from '@/contexts/DataContext';

// Hooks
import useSpotify from '@/hooks/useSpotify'

// Components
import LoadingPage from '../../loading'
import * as UI from '../../../../components/index'

// Styles
import { BsHeartFill, BsMusicNote, BsFillPlayCircleFill } from 'react-icons/bs'
import { MdHideImage } from 'react-icons/md'

const LikedSongPage = () => {
    const spotify = useSpotify();
    const route = useRouter();
    const [pageInfo, setPageInfo] = useState(undefined)
    const [loading, setLoading] = useState(true)
    const [likedSongs, setLikedSongs] = useState(undefined)
    const [updateLikedSong, setUpdateLikedSong] = useContext(DataContext)

    useEffect(() => {
        const handleLoading = async () => {
            try {
                const userInfo = await spotify.getMe();
                const likedSongs = await spotify.getMySavedTracks({ limit: 50 })

                const likedSongsId = likedSongs.body.items.map(it => [it.track.id])

                const infos = {
                    userInfo: userInfo.body,
                    likedSongsList: likedSongs.body.items,
                    likedSongNumber: likedSongs.body.items.length,
                }

                setPageInfo(infos)
                setLikedSongs(likedSongsId)
                setLoading(false)

            } catch (err) {
                console.log('Something went wrong!', err);
            }
        }
        handleLoading()
    }, [updateLikedSong])

    if (!loading)
        return (
            <div className='flex flex-col'>
                {/* Liked Song Info Section */}
                <div className='flex bg-gradient-to-t from-[#2C1F56] to-[#50399A] p-6'>
                    <div className='flex justify-center items-center bg-gradient-to-r from-[#3F13B9] to-[#7b9187] w-56 h-56'>
                        <BsHeartFill size={70} className="text-white" />
                    </div>
                    <div className='flex flex-col text-white font-bold mt-10 ml-5'>
                        <p>Playlist</p>
                        <p className='text-8xl mt-4 mb-5'>Liked Songs</p>
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
                            {pageInfo.likedSongsList.length !== 0 && <p className='font-semibold'>&bull; {pageInfo.likedSongNumber} song</p>}
                        </div>
                    </div>
                </div>
                {/* Liked Song List Section */}
                {pageInfo.likedSongsList.length !== 0 ?
                    <div className='flex flex-col bg-gradient-to-b from-[#21173F] to-spotify-dark'>
                        <button className='text-spotify-green rounded-full'>
                            <BsFillPlayCircleFill size={60} className="mt-6 ml-8 hover:scale-105" />
                        </button>
                        <table className='table-auto border-separate border-spacing-y-3 pt-6 pl-6 pr-6'>
                            <UI.TrackListHeader />
                            {pageInfo.likedSongsList.map((trackInfo, index) => {
                                return (
                                    <UI.TracksList key={trackInfo.track.id} trackInfo={trackInfo.track} index={index} likedSongs={likedSongs[index]} />
                                )
                            })}
                        </table>
                    </div>
                    :
                    <div className='flex flex-col justify-center items-center bg-gradient-to-b from-[#21173F] to-spotify-dark text-white'>
                        <BsMusicNote size={50} className='mt-10' />
                        <p className='text-3xl font-bold my-8'>Songs you like will appear here</p>
                        <p className='font-semibold mb-8'>Save songs by tapping the heart icon.</p>
                        <button className='bg-white hover:scale-105 rounded-full' onClick={() => { route.push('/search') }}>
                            <p className='text-black font-bold py-3 px-8'>Find songs</p>
                        </button>
                    </div>
                }
                <ToastContainer />
            </div>
        )
    else return <LoadingPage />
}

export default LikedSongPage