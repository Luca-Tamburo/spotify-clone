"use client"

// Imports
import React, { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

// Hooks
import useSpotify from '@/hooks/useSpotify';
import useNotification from '@/hooks/useNotification';

// Components'
import LoadingPage from '../../loading';
import { TracksList } from '@/components';

// Context
import { DataContext } from '@/contexts/DataContext';

// Styles
import { BsFillPlayCircleFill, BsThreeDots, BsClockHistory } from 'react-icons/bs'
import { HiOutlineHeart, HiHeart } from 'react-icons/hi'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PlaylistsPage = () => {
    const { data: session } = useSession();
    const spotifyApi = useSpotify();
    const notify = useNotification();
    const url = usePathname();
    const playlistId = url.split('/')[2]

    const [updateSidebar, setUpdateSidebar] = useContext(DataContext)

    const [loading, setLoading] = useState(true);
    const [playlistInfo, setPlaylistInfo] = useState(undefined);
    const [isOpen, setIsOpen] = useState(false);
    const [isFollowed, setIsFollowed] = useState(false);

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
                const playlist = await spotifyApi.getPlaylist(playlistId);
                const authorInfo = await spotifyApi.getUser(playlist.body.owner.id)
                const checkFollowPlaylists = await spotifyApi.areFollowingPlaylist(playlist.body.owner.id, playlistId, [session.user.username])

                checkFollowPlaylists.body.forEach(function (isFollowing) {
                    setIsFollowed(isFollowing)
                });

                const pageInfo = {
                    "id": playlist.body.id,
                    "name": playlist.body.name,
                    "images": playlist.body.images[0].url,
                    "owner": {
                        "id": playlist.body.owner.id,
                        "name": playlist.body.owner.display_name,
                        "image": authorInfo.body.images[0].url
                    },
                    "description": playlist.body.description,
                    "totFollowers": playlist.body.followers.total,
                    "tracks": playlist.body.tracks.items.map(it => ({
                        "id": it.track.id,
                        "type": it.track.type,
                        "artists": it.track.album.artists.map(it => ({
                            "id": it.id,
                            "name": it.name
                        })),
                        "album": {
                            "id": it.track.album.id,
                            "name": it.track.album.name,
                            "image": it.track.album.images[2].url,
                        },
                        "song": {
                            "name": it.track.name,
                            "duration": it.track.duration_ms,
                            "image": it.track.album.images[2].url,
                        }
                    })),
                }
                setPlaylistInfo(pageInfo)
                setLoading(false);
            } catch (err) {
                console.log('Something went wrong!', err);
            }
        }

        handleLoading();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    if (!loading)
        return (
            <div className='flex flex-col bg-spotify-dark pt-10 pl-7 pr-10'>
                {/* Playlist Info Section */}
                <div className='flex'>
                    <Image
                        src={playlistInfo.images}
                        alt="Playlist Background Image"
                        height={220}
                        width={220}
                    />
                    <div className='ml-8 mt-8'>
                        <p className='text-white text-sm font-bold'> Playlist</p>
                        <p className='text-white text-7xl font-bold'>{playlistInfo.name}</p>
                        <div className='mt-10'>
                            <p className='text-sm font-semibold text-spotify-light-gray mb-2'>{playlistInfo.description}</p>
                            <Image
                                src={playlistInfo.owner.image}
                                alt="Playlist Background Image"
                                width={25}
                                height={25}
                                className="inline-block"
                            />
                            <Link href={`/user/${playlistInfo.owner.id}`}>
                                <span className='text-white text-sm font-bold hover:underline mx-2'>{playlistInfo.owner.name}</span>
                            </Link>
                            <span className='text-white'>&bull;</span>
                            <span className='text-white text-sm font-semibold mx-1'>{playlistInfo.totFollowers}{' '}likes</span>
                            <span className='text-white'>&bull;</span>
                            <span className='text-white text-sm font-semibold mx-1'>{playlistInfo.tracks.length}{' '}songs,</span>
                            {/* TODO: Capire se è fattibile calcolare tutte le durate delle singole tracce e poi sommarle */}
                            {/* <p className='text-spotify-light-gray text-sm font-semibold'>about {playlistInfo.tracks.duration_ms}</p> */}
                        </div>
                    </div>
                </div>
                {/* Play section */}
                <div className='flex mt-10 '>
                    <button className='text-spotify-green bg-black rounded-full hover:scale-105'>
                        <BsFillPlayCircleFill size={60} />
                    </button>
                    {!isFollowed ?
                        <button className='mx-8 text-spotify-light-gray hover:scale-105' onClick={() => handleAddFollow(playlistInfo.id)}>
                            <HiOutlineHeart size={45} />
                        </button>
                        : <button className='mx-8 text-spotify-light-gray hover:scale-105' onClick={() => handleRemoveFollow(playlistInfo.id)}>
                            <HiHeart size={45} />
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
                    {playlistInfo.tracks.map((trackInfo, index) => {
                        return (
                            <TracksList key={trackInfo.id} trackInfo={trackInfo} index={index} />
                        )
                    })}
                </table>
                <ToastContainer />
            </div>
        )
    else return <LoadingPage />
}

export default PlaylistsPage