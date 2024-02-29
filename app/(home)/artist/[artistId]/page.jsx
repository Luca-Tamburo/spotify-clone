"use client"
// Imports
import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

// Components
import * as UI from '../../../../components/index'
import LoadingPage from '../../loading'

// Hooks
import useSpotify from '@/hooks/useSpotify'
import useNotification from '@/hooks/useNotification'

// Styles
import { MdHideImage } from 'react-icons/md'
import { BsPlayCircleFill } from 'react-icons/bs'

const ArtistPage = () => {
    const spotifyApi = useSpotify();
    const pathname = usePathname();
    const notify = useNotification();

    const [pageInfo, setPageInfo] = useState(undefined)
    const [follow, setFollow] = useState(undefined);
    const [likedSongs, setLikedSongs] = useState(undefined)
    const [updateLikedSong, setUpdateLikedSong] = useState(undefined)
    const [loading, setLoading] = useState(true);

    const artistId = pathname.split("/")[2]

    const handleAddFollow = (artistId) => {
        spotifyApi.followArtists([artistId])
            .then(() => {
                setFollow(true)
                notify.success("Added to your Artists")
            })
            .catch(() => notify.error("Error! Try again"))
    }

    const handleRemoveFollow = (artistId) => {
        spotifyApi.unfollowArtists([artistId])
            .then(() => {
                setFollow(false)
                notify.success("Removed from your Artists")
            })
            .catch(() => notify.error("Error! Try again"))
    }

    useEffect(() => {
        const handleLoading = async () => {
            try {
                const artist = await spotifyApi.getArtist(artistId)
                const isFollowing = await spotifyApi.isFollowingArtists([artistId])
                const popular = await spotifyApi.getArtistTopTracks(artistId, 'IT')
                const popularLikedSongsId = await spotifyApi.containsMySavedTracks(popular.body.tracks.map(song => song.id))
                const album = await spotifyApi.getArtistAlbums(artistId)
                const artistRelatedArtists = await spotifyApi.getArtistRelatedArtists(artistId)

                const pageData = {
                    artistInfo: artist.body,
                    popularTrack: popular.body.tracks.slice(0, 5),
                    artistAlbums: album.body.items.slice(0, 6),
                    appearsOn: album.body.items.filter(it => it.album_group === "appears_on"),
                    artistRelatedArtists: artistRelatedArtists.body.artists.slice(0, 6)
                }

                setPageInfo(pageData)
                setLikedSongs(popularLikedSongsId.body)
                setFollow(isFollowing.body)
                setLoading(false);
            } catch (err) {
                console.log('Something went wrong!', err);
            }
        }

        handleLoading();
    }, [follow, updateLikedSong]) // eslint-disable-line react-hooks/exhaustive-deps


    if (!loading)
        return (
            <div className='flex flex-col p-8 bg-spotify-dark'>
                {/* Artist Header Section */}
                <div className='flex'>
                    {pageInfo.artistInfo.images[0] ?
                        <Image
                            src={pageInfo.artistInfo.images[0].url}
                            alt="Artist Profile Image"
                            width={600}
                            height={600}
                            className="w-56 h-56"
                        />
                        : <MdHideImage />
                    }
                    <div className='flex flex-col ml-4 mt-10'>
                        <p className='text-white text-bold font-semibold'>Artist</p>
                        <p className='text-white text-6xl font-bold mt-6'>{pageInfo.artistInfo.name}</p>
                    </div>
                </div>
                <div className='flex mt-8'>
                    <button>
                        <BsPlayCircleFill size={50} className='text-spotify-green hover:scale-105 mr-6' />
                    </button>
                    {follow[0] ?
                        <button onClick={() => handleRemoveFollow(artistId)}>
                            <p className='text-white font-bold'>FOLLOWING</p>
                        </button> :
                        <button onClick={() => handleAddFollow(artistId)}>
                            <p className='text-white font-bold'>FOLLOW</p>
                        </button>
                    }
                </div>
                {/* Artist Popular Song Section */}
                <div className='flex flex-col mt-6'>
                    <p className="text-white text-2xl font-bold">Popular</p>
                    <table className='table-auto border-separate border-spacing-y-3 mt-3'>
                        {pageInfo.popularTrack.map((trackInfo, index) => {
                            return (
                                <UI.TrackLists.TracksList key={trackInfo.id} index={index} trackInfo={trackInfo} likedSongs={likedSongs[index]} setUpdateLikedSong={setUpdateLikedSong} updateLikedSong={updateLikedSong} />
                            )
                        })}
                    </table >
                </div >
                {/* Discography Section */}
                <div className='flex flex-col mt-6'>
                    {pageInfo.artistAlbums.length !== 0 &&
                        <>
                            <div className='flex justify-between'>
                                <Link href={`/artist/${artistId}/discography/all`}>
                                    <p className='text-white font-bold text-2xl hover:underline'>Discography</p>
                                </Link>
                                <Link href={`/artist/${artistId}/discography/all`}>
                                    <p className='text-spotify-light-gray text-sm font-bold mt-2 mr-6 hover:underline'>Show all</p>
                                </Link>
                            </div>
                            <div className='flex mt-4'>
                                {pageInfo.artistAlbums.map((albumInfo, index) => {
                                    return (
                                        <div key={albumInfo.id} className=' w-1/6'>
                                            <UI.Cards.AlbumCard key={albumInfo.id} albumInfo={albumInfo} />
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    }
                    {/* Fans Also Like Section */}
                    {pageInfo.artistRelatedArtists.length !== 0 &&
                        <>
                            <div className='flex flex-col mt-6'>
                                <div className='flex justify-between'>
                                    <Link href={`/artist/${artistId}/related`}><p className='text-white text-2xl font-bold hover:underline'>Fans also like</p></Link>
                                    <Link href={`/artist/${artistId}/related`}><p className='text-spotify-light-gray text-sm font-bold mt-2 mr-6 hover:underline'>Show all</p></Link>
                                </div>
                                <div className='flex flex-wrap'>
                                    {pageInfo.artistRelatedArtists.map((artistInfo, index) => {
                                        return (
                                            <div key={artistInfo.id} className='w-1/6 mt-4'>
                                                <UI.Cards.ArtistCard key={artistInfo.id} artistInfo={artistInfo} />
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </>
                    }
                    {/* Appears On Section */}
                    {pageInfo.appearsOn.length !== 0 &&
                        <>
                            <div className='flex flex-col mt-6'>
                                <div className='flex justify-between'>
                                    <Link href={`/artist/${artistId}/appears-on`}><p className='text-white text-2xl font-bold hover:underline'>Appears on</p></Link>
                                    <Link href={`/artist/${artistId}/appears-on`}><p className='text-spotify-light-gray text-sm font-bold mt-2 mr-6 hover:underline'>Show all</p></Link>
                                </div>
                                <div className='flex flex-wrap mt-4'>
                                    {pageInfo.appearsOn.map((albumInfo, index) => {
                                        return (
                                            <div key={albumInfo.id} className=' w-1/6'>
                                                <UI.Cards.AlbumCard key={albumInfo.id} albumInfo={albumInfo} />
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </>
                    }
                </div>
                <ToastContainer />
            </div >
        )
    else return <LoadingPage />
}

export default ArtistPage