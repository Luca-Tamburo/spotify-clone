"use client"

// Imports
import React, { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import copy from 'copy-to-clipboard';

// Hooks
import useSpotify from '@/hooks/useSpotify';
import useNotification from '@/hooks/useNotification';
import useDuration from '@/hooks/useDuration';

// Components
import SearchResult from './SearchResult';
import LoadingPage from '../../loading';
import * as UI from '../../../../components/index'

// Context
import { DataContext } from '@/contexts/DataContext';

// Styles
import { BsFillPlayCircleFill, BsThreeDots } from 'react-icons/bs'
import { HiOutlineHeart, HiHeart } from 'react-icons/hi'
import { MdHideImage } from 'react-icons/md'
import { FiEdit } from 'react-icons/fi'
import { AiOutlineClose } from 'react-icons/ai'

const PlaylistsPage = () => {
    const { data: session } = useSession();
    const spotifyApi = useSpotify();
    const notify = useNotification();
    const computeTime = useDuration();
    const url = usePathname();
    const playlistId = url.split('/')[2]

    const [updateSidebar, setUpdateSidebar] = useContext(DataContext)
    const [isOwner, setIsOwner] = useState(false)
    const [searchValue, setSearchValue] = useState(undefined)
    const [loading, setLoading] = useState(true);
    const [pageInfo, setPageInfo] = useState(undefined);
    const [isOpen, setIsOpen] = useState(false);
    const [isFollowed, setIsFollowed] = useState(false);
    const [duration, setDuration] = useState(undefined)
    const [likedSongs, setLikedSongs] = useState([undefined]);
    const [updateLikedSong, setUpdateLikedSong] = useState(true);
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [editName, setEditName] = useState(undefined)
    const [editDescription, setEditDescription] = useState(undefined)
    const [searchInfo, setSearchInfo] = useState({})
    const [updatePlaylist, setUpdatePlaylist] = useState(undefined)
    const [showPencil, setShowPencil] = useState(false)

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

    const handleShareLink = () => {
        copy(`https://spotify-clone-six-beta.vercel.app/playlist/${playlistId}`);
        notify.success("Link copied to clipboard")
    }

    const handleSearch = () => {
        spotifyApi.search(searchValue, ['album', 'artist', 'playlist', 'track', 'show', 'episode'], { limit: 10 })
            .then((data) => setSearchInfo(data.body))
            .catch((err) => console.log('Something went wrong!', err))
    }

    const handleEditPlaylistDetails = () => {
        spotifyApi.changePlaylistDetails(playlistId, { name: editName, description: editDescription })
            .then(() => notify.success("Your playlist details have been changed"))
            .catch(() => notify.error("Error! Try again"))
    }

    useEffect(() => {
        const handleLoading = async () => {
            try {
                const playlistInfo = await spotifyApi.getPlaylist(playlistId);
                const author = await spotifyApi.getUser(playlistInfo.body.owner.id)
                const checkFollowPlaylists = await spotifyApi.areFollowingPlaylist(playlistInfo.body.owner.id, playlistId, [session.user.username])

                if (playlistInfo.body.tracks.items.length > 0 && playlistInfo.body.tracks.items.length <= 50) {
                    const first50SongIds = playlistInfo.body.tracks.items.map(it => ([it.track.id])).slice(0, 50)
                    const checkFirst50LikedSong = await spotifyApi.containsMySavedTracks(first50SongIds)

                    setLikedSongs(checkFirst50LikedSong)
                } else if (playlistInfo.body.tracks.items.length > 50 && playlistInfo.body.tracks.items.length <= 100) {
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

                if (playlistInfo.body.owner.id === session.user.username)
                    setIsOwner(true)

                const pageInfos = {
                    "playlist": playlistInfo.body,
                    "authorInfo": author.body
                }

                const totalDurationms = pageInfos.playlist.tracks.items.map(it => ({
                    "duration": it.track.duration_ms
                })).reduce((accumulator, currentTrack) => accumulator + currentTrack.duration, 0);

                setDuration(computeTime(totalDurationms))
                setPageInfo(pageInfos)
                setLoading(false);
            } catch (err) {
                console.log('Something went wrong!', err);
            }
        }

        handleLoading();
    }, [updateLikedSong, editName, editDescription, updatePlaylist]) // eslint-disable-line react-hooks/exhaustive-deps

    if (!loading)
        return (
            <div className='flex flex-col bg-spotify-dark pt-10 pl-7 pr-10'>
                {/* Playlist Info Section */}
                <div className='flex'>
                    <div
                        className={`flex justify-center items-center w-56 h-56 ${isOpenEdit ? 'pointer-events-none' : ''}`}>
                        {pageInfo.playlist.images.length !== 0 ?
                            <Image
                                src={pageInfo.playlist.images[0].url}
                                alt="Playlist Background Image"
                                height={220}
                                width={220}
                                className="text-white font-bold"
                            /> :
                            <div onMouseOver={() => setShowPencil(true)} onMouseLeave={() => setShowPencil(false)}>
                                {showPencil ? (
                                    isOwner && (
                                        <button onClick={() => setIsOpenEdit(true)} className='text-white mt-8 ml-5'>
                                            <FiEdit size={150} />
                                        </button>
                                    )
                                ) : (
                                    <button>
                                        <MdHideImage size={150} className="mt-4 text-spotify-gray" />
                                    </button>
                                )}
                            </div>
                        }
                    </div>
                    <div className='ml-8'>
                        <p className='text-white text-sm font-bold mt-6'>Playlist</p>
                        <div className='flex'>
                            <p className={`${pageInfo.playlist.name.length >= 20 ? "text-3xl" : "text-7xl"} text-white font-bold mt-4`}>{pageInfo.playlist.name}</p>

                            {isOpenEdit &&
                                <div
                                    className="absolute top-1/3 left-1/2 z-10 flex flex-col items-center justify-center bg-spotify-light-dark rounded-lg w-64 h-64">
                                    <div className="flex justify-between z-10 mt-2 ">
                                        <p className='text-white text-xl font-bold mr-4'>Edit playlist details</p>
                                        <button onClick={() => setIsOpenEdit(false)}>
                                            <AiOutlineClose size={25} className='text-spotify-light-gray' />
                                        </button>
                                    </div>
                                    <div className="px-4 mt-2 mb-4">
                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            handleEditPlaylistDetails();
                                        }} className='flex flex-col'>
                                            <input type="text" onChange={(e) => setEditName(e.target.value)}
                                                placeholder={pageInfo.playlist.name}
                                                className='placeholder:text-spotify-light-gray font-semibold rounded-md border-none bg-spotify-gray mt-3' />
                                            <input type="text" onChange={(e) => setEditDescription(e.target.value)}
                                                placeholder={pageInfo.playlist.description ? pageInfo.playlist.description : "Add an optional description"}
                                                className='placeholder:text-spotify-light-gray font-semibold rounded-md border-none bg-spotify-gray mt-3 h-20' />
                                            <button type="submit"
                                                className='font-semibold rounded-lg border-none bg-white p-2 mt-2 '>
                                                <p className='text-black'>Save</p></button>
                                        </form>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className={`mt-4 ${isOpenEdit ? 'pointer-events-none' : ''}`}>
                            <p className='text-sm font-semibold text-spotify-light-gray mt-4 mb-2'>{pageInfo.playlist.description}</p>
                            {pageInfo.authorInfo.images[0] &&
                                <Image
                                    src={pageInfo.authorInfo.images[0].url}
                                    alt="User Profile Image"
                                    width={25}
                                    height={25}
                                    className="rounded-full inline-block"
                                />
                            }
                            <Link href={`/user/${pageInfo.playlist.owner.id}`}>
                                <span
                                    className='text-white text-sm font-bold hover:underline mx-2'>{pageInfo.playlist.owner.display_name}</span>
                            </Link>
                            {pageInfo.playlist.tracks.total !== 0 &&
                                <>
                                    <span className='text-white'>&bull;</span>
                                    <span
                                        className='text-white text-sm font-semibold mx-1'>{pageInfo.playlist.followers.total}{' '}likes</span>
                                    <span className='text-white'>&bull;</span>
                                    {pageInfo.playlist.tracks.items.length === 1 ?
                                        <span
                                            className='text-sm text-white font-semibold mx-1'>{pageInfo.playlist.tracks.items.length} song,</span>
                                        : <span
                                            className='text-sm text-white font-semibold mx-1'>{pageInfo.playlist.tracks.items.length} songs,</span>
                                    }
                                    <span
                                        className='text-spotify-light-gray text-sm font-semibold'>about {duration}</span>
                                </>
                            }
                        </div>
                    </div>
                </div>
                {/* Play section */}
                <div className={`flex mt-10 ${isOpenEdit ? 'pointer-events-none' : ''}`}>
                    {pageInfo.playlist.tracks.total !== 0 &&
                        <button className='text-spotify-green bg-black rounded-full hover:scale-105'>
                            <BsFillPlayCircleFill size={60} />
                        </button>
                    }
                    {!isOwner && (
                        !isFollowed ? (
                            <button className='mx-8 text-spotify-light-gray hover:scale-105'
                                onClick={() => handleAddFollow(pageInfo.playlist.id)}>
                                <HiOutlineHeart size={45} />
                            </button>
                        ) : (
                            <button className='mx-8 text-spotify-light-gray hover:scale-105'
                                onClick={() => handleRemoveFollow(pageInfo.playlist.id)}>
                                <HiHeart size={45} className="text-spotify-green" />
                            </button>
                        )
                    )}
                    <div className='relative text-spotify-light-gray mt-3'>
                        <button onClick={() => setIsOpen(!isOpen)} className='m-2 inline-flex ml-4'>
                            <BsThreeDots size={30} />
                        </button>
                        {isOpen &&
                            <div className='absolute bg-spotify-light-dark text-white mt-2 font-semibold rounded'
                                onMouseLeave={() => setIsOpen(false)} onClick={() => setIsOpen(false)}>
                                <ul className='pt-2 pl-2 pb-2 pr-1 w-40'>
                                    <li className='hover:bg-spotify-gray rounded'>
                                        <button>Add to queue</button>
                                    </li>
                                    <li className='my-3 hover:bg-spotify-gray rounded'>
                                        <button className='border-b'
                                            onClick={() => handleAddFollow(pageInfo.playlist.id)}>Add to your
                                            library
                                        </button>
                                    </li>
                                    <li className='hover:bg-spotify-gray rounded'>
                                        <button onClick={handleShareLink}>Copy link to playlist</button>
                                    </li>
                                </ul>
                            </div>
                        }
                    </div>
                </div>
                {/* Tracks section */}
                {
                    pageInfo.playlist.tracks.items.length !== 0 ?
                        <table
                            className={`table-auto border-separate border-spacing-y-3 mt-6 ${isOpenEdit ? 'pointer-events-none' : ''}`}>
                            <UI.TrackLists.TrackListHeader />
                            {pageInfo.playlist.tracks.items.map((trackInfo, index) => {
                                return (
                                    <UI.TrackLists.TracksList key={trackInfo.track.id} trackInfo={trackInfo.track}
                                        index={index} likedSongs={likedSongs[index]}
                                        setUpdateLikedSong={setUpdateLikedSong}
                                        updateLikedSong={updateLikedSong} isOwner={isOwner}
                                        playlistId={playlistId} updatePlaylist={updatePlaylist}
                                        setUpdatePlaylist={setUpdatePlaylist} />
                                )
                            })}
                        </table>
                        : <div className={`${isOpenEdit ? 'pointer-events-none' : ''}`}>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleSearch();
                            }}>
                                <label htmlFor='search'><p className='text-xl font-bold text-white'>Let&rsquo;s find
                                    something for your playlist</p></label>
                                <input type="search" onChange={(e) => setSearchValue(e.target.value)}
                                    placeholder='Search for songs or episodes'
                                    className='placeholder:text-spotify-light-gray font-semibold rounded-md border-none bg-[#2C2C2C] mt-3 w-[22rem]' />
                                <button type="submit"
                                    className='font-semibold rounded-md border-none bg-[#2C2C2C] p-2 ml-4'><p
                                        className='text-white'>Search</p></button>
                            </form>
                            <SearchResult searchInfo={searchInfo} playlistId={playlistId} updatePlaylist={updatePlaylist}
                                setUpdatePlaylist={setUpdatePlaylist} />
                        </div>
                }
                <ToastContainer />
            </div>
        )
    else return <LoadingPage />
}

export default PlaylistsPage