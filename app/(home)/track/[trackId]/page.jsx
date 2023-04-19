"use client"

// Imports
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import dayjs from 'dayjs'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

// Components
import LoadingPage from '@/app/(home)/loading'
import * as UI from '@/components/index'

// Hooks
import useSpotify from '@/hooks/useSpotify'
import useNotify from '@/hooks/useNotification'

// Styles
import { BsFillPlayCircleFill, BsThreeDots } from 'react-icons/bs'
import { HiOutlineHeart, HiHeart } from 'react-icons/hi'
import { MdHideImage } from 'react-icons/md'

const TrackPage = () => {
    const spotifyApi = useSpotify()
    const pathname = usePathname()
    const notify = useNotify()

    const trackId = pathname.split('/')[2]

    const [pageInfo, setPageInfo] = useState(undefined)
    const [time, setTime] = useState(undefined)
    const [likedSongs, setLikedSongs] = useState(undefined)
    const [updateLikedSong, setUpdateLikedSong] = useState(true);
    const [isFollowed, setIsFollowed] = useState(true)
    const [loading, setLoading] = useState(true)

    const handleAddFollow = (trackId) => {
        spotifyApi.addToMySavedTracks(trackId)
            .then(() => {
                setIsFollowed(true)
                notify.success("Added to Your Liked Songs")
            }).catch((err) => {
                notify.error("Error! Try again")
                console.log('Something went wrong!', err);
            })
    }

    const handleRemoveFollow = (trackId) => {
        spotifyApi.removeFromMySavedTracks(trackId)
            .then(() => {
                setIsFollowed(false);
                notify.success("Removed from Your Liked Songs")
            }).catch((err) => {
                notify.error("Error! Try again")
                console.log('Something went wrong!', err);
            })
    }


    useEffect(() => {
        const handleLoading = async () => {
            try {

                const track = await spotifyApi.getTrack(trackId)
                const artist = await spotifyApi.getArtist(track.body.artists[0].id)
                const topTrack = await spotifyApi.getArtistTopTracks(track.body.artists[0].id, 'IT')
                const popularLikedSongsId = await spotifyApi.containsMySavedTracks(topTrack.body.tracks.map(song => song.id))

                spotifyApi.containsMySavedTracks([trackId])
                    .then((data) => {
                        setIsFollowed(data.body[0])
                    }).catch((err) => {
                        console.log('Something went wrong!', err);
                    })

                const pageData = {
                    trackInfo: track.body,
                    artistInfo: artist.body,
                    artistTopTrack: topTrack.body.tracks.slice(0, 5),
                }

                const minutes = Math.floor(pageData.trackInfo.duration_ms / 60000)
                const seconds = ((pageData.trackInfo.duration_ms % 60000) / 1000).toFixed(0)

                setTime(minutes + ":" + seconds)
                setPageInfo(pageData)
                setLikedSongs(popularLikedSongsId.body)
                setLoading(false)
            } catch (err) {
                console.log('Something went wrong!', err);
            }
        }
        handleLoading()
    }, [updateLikedSong])

    if (!loading)
        return (
            <div className='flex flex-col bg-spotify-dark p-7'>
                {/* Track Header Section */}
                <div className='flex'>
                    {pageInfo.trackInfo.album.images.length === 0 ? <MdHideImage /> :
                        <Image
                            src={pageInfo.trackInfo.album.images[0].url}
                            alt='Track Image'
                            width={640}
                            height={640}
                            className='w-60 h-60'
                        />
                    }
                    <div className='flex flex-col ml-4 mt-10 text-white font-bold'>
                        <p className="text-sm">Song</p>
                        <p className='text-8xl mt-6'>{pageInfo.trackInfo.name}</p>
                        <div className='flex mt-6'>
                            {pageInfo.artistInfo.images.length === 0 ? <MdHideImage /> :
                                <Image
                                    src={pageInfo.artistInfo.images[0].url}
                                    alt='Track Image'
                                    width={640}
                                    height={640}
                                    className='w-8 h-8 rounded-full mr-2'
                                />
                            }
                            <Link href={`/artist/${pageInfo.artistInfo.id}`}>
                                <span className='hover:underline'>{pageInfo.artistInfo.name}</span>
                            </Link>
                            <span className='mx-1'>&bull;</span>
                            <span>{dayjs(pageInfo.trackInfo.album.release_date).format("YYYY")}</span>
                            <span className='mx-1'>&bull;</span>
                            <span>{time}</span>
                        </div>
                    </div>
                </div>
                {/* Play Section */}
                <div className='flex'>
                    <button className='text-spotify-green rounded-full'>
                        <BsFillPlayCircleFill size={50} className="mt-6 ml-8 hover:scale-105" />
                    </button>
                    {isFollowed ?
                        <button onClick={() => handleRemoveFollow([trackId])}>
                            <HiHeart size={45} className="mt-6 ml-8 text-spotify-green hover:scale-105" />
                        </button>
                        :
                        <button onClick={() => handleAddFollow([trackId])}>
                            <HiOutlineHeart size={45} className="mt-6 ml-8 text-spotify-light-gray hover:scale-105 hover:text-white" />
                        </button>
                    }
                </div>
                {/* Artist Popular Section */}
                <div className='flex flex-col mt-8'>
                    <p className="text-spotify-light-gray text-sm font-bold ml-10">Popular Tracks by</p>
                    <p className='text-white text-2xl font-bold ml-10'>{pageInfo.artistInfo.name}</p>
                    <table className='table-auto border-separate border-spacing-y-3 mt-3 mx-6'>
                        {pageInfo.artistTopTrack.map((trackInfo, index) => {
                            return (
                                <UI.TrackLists.TracksList key={trackInfo.id} index={index} trackInfo={trackInfo} likedSongs={likedSongs[index]} setUpdateLikedSong={setUpdateLikedSong} updateLikedSong={updateLikedSong} />
                            )
                        })}
                    </table>
                </div>
                <ToastContainer />
            </div>
        )
    else return <LoadingPage />
}

export default TrackPage