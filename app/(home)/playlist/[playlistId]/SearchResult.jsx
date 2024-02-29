// Imports
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react';
const axios = require('axios');

// Hooks
import useSpotify from '@/hooks/useSpotify';
import useNotification from '@/hooks/useNotification';

// Styles
import { SlArrowRight, SlArrowLeft } from 'react-icons/sl'

const SearchResult = ({ searchInfo, playlistId, updatePlaylist, setUpdatePlaylist }) => {
    const { data: session } = useSession();
    const spotifyApi = useSpotify();
    const notify = useNotification();

    const [isOpenAllArtists, setIsOpenAllArtists] = useState(false)
    const [isOpenAllAlbums, setIsOpenAllAlbums] = useState(false)
    const [isOpenAllSongs, setIsOpenAllSongs] = useState(false)

    const handleAddTrack = (trackId) => {
        spotifyApi.addTracksToPlaylist(playlistId, [`spotify:track:${trackId}`])
            .then(() => {
                notify.success("Added to Playlist")
                setUpdatePlaylist(!updatePlaylist)
            })
            .catch(() => notify.error("Error! Try again"))
    }

    const handleAddEpisode = (episodeId) => {
        axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, { "uris": [`spotify:episode:${episodeId}`] },
            {
                headers: {
                    'Authorization': `Bearer ${session.user.accessToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(() => {
                notify.success("Added to Your Episodes")
                setUpdatePlaylist(!updatePlaylist)
            })
            .catch(() => notify.error("Error! Try again"))
    }

    return (
        <>
            {(!isOpenAllAlbums && !isOpenAllArtists && !isOpenAllSongs) &&
                <div className='mt-5 '>
                    {searchInfo.artistInfo && searchInfo.artists.items.slice(0, 2).map((artist, index) => {
                        return (
                            <Link href={`/artist/${artist.id}`} key={artist.id} className='flex p-2 hover:bg-spotify-gray rounded-md'>
                                <Image src={artist.images[0].url} alt='Artist Search Result Image' width={200} height={200} className='w-12 h-12' />
                                <div className='flex justify-between w-full'>
                                    <div className='flex flex-col ml-4'>
                                        <p className='text-white font-semibold'>{artist.name}</p>
                                        <p className='text-spotify-light-gray text-sm mt-1'>Artist</p>
                                    </div>
                                    <SlArrowRight size={25} className='text-white mt-2' />
                                </div>
                            </Link>
                        )
                    })}
                    {/* Tracks Search Result */}
                    {searchInfo.tracks && searchInfo.tracks.items.slice(0, 2).map((track, index) => {
                        return (
                            <div key={track.id} className='flex p-2 hover:bg-spotify-gray hover:text-white rounded-md'>
                                <Image src={track.album.images[0].url} alt='Track Search Result Image' width={200} height={200} className='w-12 h-12' />
                                <div className='flex justify-between w-full'>
                                    <div className='flex flex-col ml-4'>
                                        <p className='text-white font-semibold'>{track.name}</p>
                                        <div className='flex'>
                                            {track.artists.length === 1 ?
                                                track.artists.map((artist, index) => {
                                                    return (
                                                        <Link href={`/artist/${artist.id}`} key={artist.id} className="hover:underline">
                                                            <p className='text-spotify-light-gray text-sm font-semibold hover:underline'>{artist.name}</p>
                                                        </Link>
                                                    )
                                                }) : track.artists.map((artist, index) => {
                                                    return (
                                                        <Link href={`/artist/${artist.id}`} key={artist.id} className="hover:underline">
                                                            <p className='text-spotify-light-gray text-sm font-semibold hover:underline'>{artist.name}{index !== track.artists.length - 1 ? ",\u00a0" : ""}</p>
                                                        </Link>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                    <Link href={`/album/${track.album.id}`} className='hover:underline text-spotify-light-gray mt-2'>
                                        <p>{track.album.name}</p>
                                    </Link>
                                    <button onClick={() => handleAddTrack(track.id)} className='border rounded-full border-white py-1 px-5 hover:scale-105'>
                                        <p className='text-white font-bold'>Add</p>
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                    {/* Albums Search Result */}
                    {searchInfo.albums && searchInfo.albums.items.slice(0, 2).map((album, index) => {
                        return (
                            <Link href={`/album/${album.id}`} key={album.id} className='flex p-2 hover:bg-spotify-gray rounded-md'>
                                <Image src={album.images[0].url} alt='Album Search Result Image' width={200} height={200} className='w-12 h-12' />
                                <div className='flex justify-between w-full'>
                                    <div className='flex flex-col ml-4'>
                                        <p className='text-white font-semibold'>{album.name}</p>
                                        <p className='text-spotify-light-gray text-sm mt-1'>Album</p>
                                    </div>
                                    <SlArrowRight size={25} className='text-white mt-2' />
                                </div>
                            </Link>
                        )
                    })}
                    {/* Episodes Search Result */}
                    {searchInfo.episodes && searchInfo.episodes.items.slice(0, 2).map((episode, index) => {
                        return (
                            <div key={episode.id} className='flex p-2 hover:bg-spotify-gray hover:text-white rounded-md'>
                                <Image src={episode.images[0].url} alt='Episode Search Result Image' width={200} height={200} className='w-12 h-12' />
                                <div className='flex justify-between w-full ml-2'>
                                    <p className='text-white font-semibold'>{episode.name}</p>
                                    <button onClick={() => handleAddEpisode(episode.id)} className='border rounded-full border-white py-1 px-5 hover:scale-105'>
                                        <p className='text-white font-bold'>Add</p>
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                    {/* Shows Search Result */}
                    {searchInfo.shows && searchInfo.shows.items.slice(0, 2).map((show, index) => {
                        return (
                            <Link href={`/show/${show.id}`} key={show.id} className='flex p-2 hover:bg-spotify-gray rounded-md'>
                                <Image src={show.images[0].url} alt='Show Search Result Image' width={200} height={200} className='w-12 h-12' />
                                <div className='flex justify-between w-full'>
                                    <div className='flex flex-col ml-4'>
                                        <p className='text-white font-semibold'>{show.name}</p>
                                        <p className='text-spotify-light-gray text-sm mt-1'>Show</p>
                                    </div>
                                    <SlArrowRight size={25} className='text-white mt-2' />
                                </div>
                            </Link>
                        )
                    })}
                    <button onClick={() => { setIsOpenAllArtists(true); setIsOpenAllAlbums(false); setIsOpenAllSongs(false) }} className='flex justify-between px-2 py-4 w-full hover:bg-spotify-gray hover:text-white rounded-md'>
                        <p className='text-white font-semibold'>See all Artists</p>
                        <SlArrowRight size={25} className='text-white' />
                    </button>
                    <button onClick={() => { setIsOpenAllArtists(false); setIsOpenAllAlbums(true); setIsOpenAllSongs(false) }} className='flex justify-between px-2 py-4 w-full hover:bg-spotify-gray hover:text-white rounded-md'>
                        <p className='text-white font-semibold'>See all Albums</p>
                        <SlArrowRight size={25} className='text-white' />
                    </button>
                    <button onClick={() => { setIsOpenAllArtists(false); setIsOpenAllAlbums(false); setIsOpenAllSongs(true) }} className='flex justify-between px-2 py-4 w-full hover:bg-spotify-gray hover:text-white rounded-md'>
                        <p className='text-white font-semibold'>See all Songs</p>
                        <SlArrowRight size={25} className='text-white' />
                    </button>
                </div>
            }
            <div className='mt-5 '>
                {/* All Artists Search Result */}
                {!isOpenAllArtists && isOpenAllAlbums && !isOpenAllSongs &&
                    <>
                        <button onClick={() => { setIsOpenAllArtists(false); setIsOpenAllAlbums(false); setIsOpenAllSongs(false) }} className='flex py-4 w-full hover:bg-spotify-gray hover:text-white rounded-md'>
                            <SlArrowLeft size={25} className='text-white' />
                            <p className='text-white font-semibold ml-4'>See all albums</p>
                        </button>
                        {searchInfo.artists ? searchInfo.artists.items.map((artist, index) => {
                            return (
                                <Link href={`/artist/${artist.id}`} key={artist.id} className='flex p-2 hover:bg-spotify-gray rounded-md'>
                                    <Image src={artist.images[0].url} alt='Artist Search Result Image' width={200} height={200} className='w-12 h-12' />
                                    <div className='flex justify-between w-full'>
                                        <div className='flex flex-col ml-4'>
                                            <p className='text-white font-semibold'>{artist.name}</p>
                                            <p className='text-spotify-light-gray text-sm mt-1'>Artist</p>
                                        </div>
                                        <SlArrowRight size={25} className='text-white mt-2' />
                                    </div>
                                </Link>
                            )
                        }) : <p className=' text-spotify-light-gray'>Search something...</p>}
                    </>
                }
                {/* All Albums Search Result */}
                {isOpenAllArtists && !isOpenAllAlbums && !isOpenAllSongs &&
                    <>
                        <button onClick={() => { setIsOpenAllArtists(false); setIsOpenAllAlbums(false); setIsOpenAllSongs(false) }} className='flex py-4 w-full hover:bg-spotify-gray hover:text-white rounded-md'>
                            <SlArrowLeft size={25} className='text-white' />
                            <p className='text-white font-semibold ml-4'>See all artists</p>
                        </button>
                        {searchInfo.albums ? searchInfo.albums.items.map((album, index) => {
                            return (
                                <Link href={`/album/${album.id}`} key={album.id} className='flex p-2 hover:bg-spotify-gray rounded-md'>
                                    <Image src={album.images[0].url} alt='Album Search Result Image' width={200} height={200} className='w-12 h-12' />
                                    <div className='flex justify-between w-full'>
                                        <div className='flex flex-col ml-4'>
                                            <p className='text-white font-semibold'>{album.name}</p>
                                            <p className='text-spotify-light-gray text-sm mt-1'>Album</p>
                                        </div>
                                        <SlArrowRight size={25} className='text-white mt-2' />
                                    </div>
                                </Link>
                            )
                        }) : <p className=' text-spotify-light-gray'>Search something...</p>}
                    </>
                }
                {/* All Songs Search Result */}
                {!isOpenAllArtists && !isOpenAllAlbums && isOpenAllSongs &&
                    <>
                        <button onClick={() => { setIsOpenAllArtists(false); setIsOpenAllAlbums(false); setIsOpenAllSongs(false) }} className='flex py-4 w-full hover:bg-spotify-gray hover:text-white rounded-md'>
                            <SlArrowLeft size={25} className='text-white' />
                            <p className='text-white font-semibold ml-4'>See all songs</p>
                        </button>
                        {searchInfo.tracks ? searchInfo.tracks.items.map((track, index) => {
                            return (
                                <div key={track.id} className='flex p-2 hover:bg-spotify-gray hover:text-white rounded-md'>
                                    <Image src={track.album.images[0].url} alt='Track Search Result Image' width={200} height={200} className='w-12 h-12' />
                                    <div className='flex justify-between w-full'>
                                        <div className='flex flex-col ml-4'>
                                            <p className='text-white font-semibold'>{track.name}</p>
                                            <div className='flex'>
                                                {track.artists.length === 1 ?
                                                    track.artists.map((artist, index) => {
                                                        return (
                                                            <Link href={`/artist/${artist.id}`} key={artist.id} className="hover:underline">
                                                                <p className='text-spotify-light-gray text-sm font-semibold hover:underline'>{artist.name}</p>
                                                            </Link>
                                                        )
                                                    }) : track.artists.map((artist, index) => {
                                                        return (
                                                            <Link href={`/artist/${artist.id}`} key={artist.id} className="hover:underline">
                                                                <p className='text-spotify-light-gray text-sm font-semibold hover:underline'>{artist.name}{index !== track.artists.length - 1 ? ",\u00a0" : ""}</p>
                                                            </Link>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <Link href={`/album/${track.album.id}`} className='hover:underline text-spotify-light-gray mt-2'>
                                            <p>{track.album.name}</p>
                                        </Link>
                                        <button onClick={() => handleAddTrack(track.id)} className='border rounded-full border-white py-1 px-5 hover:scale-105'>
                                            <p className='text-white font-bold'>Add</p>
                                        </button>
                                    </div>
                                </div>
                            )
                        }) : <p className=' text-spotify-light-gray'>Search something...</p>}
                    </>
                }
            </div>
        </>
    )
}

export default SearchResult