"use client"

// Imports
import React, { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

// Hooks
import useSpotify from '@/hooks/useSpotify';
import useNotification from '@/hooks/useNotification';

// Components'
import LoadingPage from '../../loading';
import * as UI from '../../../../components/index'

// Context
import { DataContext } from '@/contexts/DataContext';

// Styles
import { BsFillPlayCircleFill, BsThreeDots } from 'react-icons/bs'
import { HiOutlineHeart, HiHeart } from 'react-icons/hi'
import { MdHideImage } from 'react-icons/md'

const PlaylistsPage = () => {
    const { data: session } = useSession();
    const spotifyApi = useSpotify();
    const notify = useNotification();
    const url = usePathname();
    const playlistId = url.split('/')[2]

    const [updateSidebar, setUpdateSidebar] = useContext(DataContext)

    const [loading, setLoading] = useState(true);
    const [pageInfo, setPageInfo] = useState(undefined);
    const [isOpen, setIsOpen] = useState(false);
    const [isFollowed, setIsFollowed] = useState(false);
    const [duration, setDuration] = useState(undefined)
    const [likedSongs, setLikedSongs] = useState([undefined]);
    const [updateLikedSong, setUpdateLikedSong] = useState(true);

    const handleAddFollow = (playlistId) => {
        spotifyApi.followPlaylist(playlistId, { 'public': true })
            .then(() => {
                notify.success("Saved to Your Library")
                setIsFollowed(true);
                setUpdateSidebar(!updateSidebar);
            })
            .catch(() => {
                notify.error("Error! Try again")
            })
    }

    const handleRemoveFollow = (playlistId) => {
        spotifyApi.unfollowPlaylist(playlistId)
            .then(() => {
                notify.success("Removed from Your Library")
                setIsFollowed(false);
                setUpdateSidebar(!updateSidebar);
            })
            .catch(() => {
                notify.error("Error! Try again")
            })
    }

    useEffect(() => {
        const handleLoading = async () => {
            try {
                const playlistInfo = await spotifyApi.getPlaylist(playlistId);
                const author = await spotifyApi.getUser(playlistInfo.body.owner.id)
                const checkFollowPlaylists = await spotifyApi.areFollowingPlaylist(playlistInfo.body.owner.id, playlistId, [session.user.username])

                if (playlistInfo.body.tracks.items.length !== 0) {

                    const first50SongIds = playlistInfo.body.tracks.items.map(it => ([it.track.id])).slice(0, 50)
                    const second50SongIds = playlistInfo.body.tracks.items.map(it => ([it.track.id])).slice(51, 100)

                    const checkFirst50LikedSong = await spotifyApi.containsMySavedTracks(first50SongIds)
                    const checkSecond50LikedSong = await spotifyApi.containsMySavedTracks(second50SongIds)

                    const checkLikedSong = checkFirst50LikedSong.body.concat(checkSecond50LikedSong.body)
                    setLikedSongs(checkLikedSong)
                }

                checkFollowPlaylists.body.forEach(function (isFollowing) {
                    setIsFollowed(isFollowing)
                });

                const pageInfos = {
                    "playlist": playlistInfo.body,
                    "authorInfo": author.body
                }

                const totalDurationms = pageInfos.playlist.tracks.items.map(it => ({
                    "duration": it.track.duration_ms
                })).reduce((accumulator, currentTrack) => accumulator + currentTrack.duration, 0);
                const hours = Math.floor(totalDurationms / 3600000);
                const minutes = Math.floor((totalDurationms % 3600000) / 60000);

                setPageInfo(pageInfos)
                setDuration(hours + " hr " + minutes + " min")
                setLoading(false);
            } catch (err) {
                console.log('Something went wrong!', err);
            }
        }

        handleLoading();
    }, [updateLikedSong]) // eslint-disable-line react-hooks/exhaustive-deps

    if (!loading)
        return (
            <div className='flex flex-col bg-spotify-dark pt-10 pl-7 pr-10'>
                {/* Playlist Info Section */}
                <div className='flex'>
                    <div className='flex justify-center items-center w-56 h-56'>
                        {pageInfo.playlist.images.length !== 0 ?
                            <Image
                                src={pageInfo.playlist.images[0].url}
                                alt="Playlist Background Image"
                                height={220}
                                width={220}
                                className="text-white font-bold"
                            /> :
                            <button>
                                <MdHideImage size={150} className="mt-4 text-spotify-gray" />
                            </button>
                        }
                    </div>
                    <div className='ml-8'>
                        <p className='text-white text-sm font-bold mt-6'> Playlist</p>
                        <p className={`${pageInfo.playlist.name.length >= 20 ? "text-3xl" : "text-7xl"} text-white font-bold mt-4`}>{pageInfo.playlist.name}</p>
                        <div className='mt-4'>
                            <p className='text-sm font-semibold text-spotify-light-gray mt-4 mb-2'>{pageInfo.playlist.description}</p>
                            {pageInfo.authorInfo.images[0].url &&
                                <Image
                                    src={pageInfo.authorInfo.images[0].url}
                                    alt="User Profile Image"
                                    width={25}
                                    height={25}
                                    className="inline-block"
                                />
                            }
                            <Link href={`/user/${pageInfo.playlist.owner.id}`}>
                                <span className='text-white text-sm font-bold hover:underline mx-2'>{pageInfo.playlist.owner.display_name}</span>
                            </Link>
                            <span className='text-white'>&bull;</span>
                            <span className='text-white text-sm font-semibold mx-1'>{pageInfo.playlist.followers.total}{' '}likes</span>
                            <span className='text-white'>&bull;</span>
                            <span className='text-white text-sm font-semibold mx-1'>{pageInfo.playlist.tracks.items.length}{' '}songs,</span>
                            <span className='text-spotify-light-gray text-sm font-semibold'>about {duration}</span>
                        </div>
                    </div>
                </div >
                {/* Play section */}
                <div className='flex mt-10' >
                    <button className='text-spotify-green bg-black rounded-full hover:scale-105'>
                        <BsFillPlayCircleFill size={60} />
                    </button>
                    {
                        !isFollowed ?
                            <button className='mx-8 text-spotify-light-gray hover:scale-105' onClick={() => handleAddFollow(pageInfo.playlist.id)}>
                                <HiOutlineHeart size={45} />
                            </button>
                            : <button className='mx-8 text-spotify-light-gray hover:scale-105' onClick={() => handleRemoveFollow(pageInfo.playlist.id)}>
                                <HiHeart size={45} className="text-spotify-green" />
                            </button>
                    }
                    <div className='relative text-spotify-light-gray mt-3'>
                        <button onClick={() => setIsOpen(!isOpen)} className='m-2 inline-flex'>
                            <BsThreeDots size={25} />
                        </button>
                        {isOpen &&
                            <div className='absolute bg-spotify-light-dark text-white mt-2 font-semibold rounded' onMouseLeave={() => setIsOpen(false)} onClick={() => setIsOpen(false)}>
                                <ul className='m-3 pt-1'>
                                </ul>
                            </div>
                        }
                    </div>
                </div>
                {/* Tracks section */}
                {
                    pageInfo.playlist.tracks.items.length !== 0 ?
                        <table className='table-auto border-separate border-spacing-y-3 mt-6'>
                            <UI.TrackListHeader />
                            {pageInfo.playlist.tracks.items.map((trackInfo, index) => {
                                return (
                                    <UI.TracksList key={trackInfo.track.id} trackInfo={trackInfo.track} index={index} likedSongs={likedSongs[index]} setUpdateLikedSong={setUpdateLikedSong} updateLikedSong={updateLikedSong} />
                                )
                            })}
                        </table>
                        : <div className='flex flex-col mt-10'>
                            <p className='text-2xl font-bold text-white'>Let&rsquo;s find something for your playlist</p>
                            {/* TODO: Inserire search bar per le canzoni */}
                        </div>
                }
                <ToastContainer />
            </div >
        )
    else return <LoadingPage />
}

export default PlaylistsPage