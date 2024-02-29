"use client"
// Imports
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import dayjs from 'dayjs'
import { usePathname } from 'next/navigation'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

// Hooks
import useSpotify from '@/hooks/useSpotify'
import useNotification from '@/hooks/useNotification'
import useDuration from '@/hooks/useDuration'

// Components
import LoadingPage from '../../loading'
import * as UI from '../../../../components/index'

// Styles
import { MdHideImage } from 'react-icons/md'
import { BsFillPlayCircleFill, BsThreeDots } from 'react-icons/bs'
import { HiOutlineHeart, HiHeart } from 'react-icons/hi'

const AlbumPage = () => {
    const spotifyApi = useSpotify();
    const notify = useNotification();
    const computeTime = useDuration();
    const pathname = usePathname();

    const [pageInfo, setPageInfo] = useState(undefined);
    const [likedSongs, setLikedSongs] = useState(undefined)
    const [albumLikedSongs, setAlbumLikedSongs] = useState(undefined)
    const [updateLikedSong, setUpdateLikedSong] = useState(true);
    const [duration, setDuration] = useState(undefined)
    const [isFollowed, setIsFollowed] = useState(true);
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(true);

    const albumId = pathname.split("/")[2];

    const handleAddFollow = (albumId) => {
        spotifyApi.addToMySavedAlbums(albumId)
            .then(() => {
                setIsFollowed(true)
                notify.success("Added to Your Albums")
            }).catch((err) => {
                notify.error("Error! Try again")
                console.log('Something went wrong!', err);
            })
    }

    const handleRemoveFollow = (albumId) => {
        spotifyApi.removeFromMySavedAlbums(albumId)
            .then(() => {
                setIsFollowed(false);
                notify.success("Removed from Your Albums")
            }).catch((err) => {
                notify.error("Error! Try again")
                console.log('Something went wrong!', err);
            })
    }

    const handleShareLink = () => {
        copy(`https://spotify-clone-six-beta.vercel.app/album/${albumId}`);
        notify.success("Link copied to clipboard")
    }

    useEffect(() => {
        const handleLoading = async () => {
            try {
                const album = await spotifyApi.getAlbum(albumId)
                const likedAlbumTrackId = await spotifyApi.containsMySavedTracks(album.body.tracks.items.map(track => track.id))
                const artists = await spotifyApi.getArtists(album.body.artists.map(it => it.id))
                const artistTopTrack = await spotifyApi.getArtistTopTracks(artists.body.artists[0].id, 'IT')
                const popularLikedSongsId = await spotifyApi.containsMySavedTracks(artistTopTrack.body.tracks.map(song => song.id))
                const artistRelatedArtists = await spotifyApi.getArtistRelatedArtists(artists.body.artists[0].id)
                const checkFollowAlbum = await spotifyApi.containsMySavedAlbums([albumId])

                checkFollowAlbum.body.forEach(function (isFollowing) {
                    setIsFollowed(isFollowing)
                });

                const pageData = {
                    albumInfo: album.body,
                    artistsInfo: artists.body,
                    artistTopTrack: artistTopTrack.body.tracks.slice(0, 4),
                    artistRelatedArtists: artistRelatedArtists.body.artists.slice(0, 6)
                }

                const totalDurationms = pageData.albumInfo.tracks.items.map(it => ({
                    "duration": it.duration_ms
                })).reduce((accumulator, currentTrack) => accumulator + currentTrack.duration, 0);


                setDuration(computeTime(totalDurationms))

                setPageInfo(pageData)
                setAlbumLikedSongs(likedAlbumTrackId.body)
                setLikedSongs(popularLikedSongsId.body)
                setLoading(false);
            } catch (err) {
                console.log('Something went wrong!', err);
            }
        }
        handleLoading();
    }, [updateLikedSong]) // eslint-disable-line react-hooks/exhaustive-deps

    if (!loading)
        return (
            <div className='flex flex-col bg-spotify-dark'>
                {/* Album Header Section */}
                <div className='flex m-6'>
                    {pageInfo.albumInfo.images[0].url ?
                        <Image
                            src={pageInfo.albumInfo.images[0].url}
                            alt='Album Image'
                            width={640}
                            height={640}
                            className="w-56 h-56"
                        /> : <MdHideImage size={25} className="w-56 h-56" />
                    }
                    <div className='flex flex-col text-white font-bold ml-4'>
                        <p className='text-sm mt-14'>{pageInfo.albumInfo.album_type.charAt(0).toUpperCase()}{pageInfo.albumInfo.album_type.slice(1)}</p>
                        <p className='text-8xl mt-2'>{pageInfo.albumInfo.name}</p>
                        <div className='flex mt-5'>
                            {pageInfo.albumInfo.artists.length === 1 &&
                                pageInfo.artistsInfo.artists[0].images[0].url ?
                                <Image
                                    src={pageInfo.artistsInfo.artists[0].images[0].url}
                                    alt="Artist Image"
                                    width={640}
                                    height={640}
                                    className="rounded-full w-6 h-6 mr-3"
                                /> : <MdHideImage size={25} className="w-6 h-6" />
                            }
                            <div className='flex mt-1'>
                                {pageInfo.artistsInfo.artists.map((artistInfo, index) => {
                                    return (
                                        <>
                                            <Link href={`/artist/${artistInfo.id}`} className='text-sm hover:underline'>{artistInfo.name}</Link>
                                            <p className='mx-1 text-sm'>&bull;</p>
                                        </>
                                    )
                                })}
                                <p className='text-sm'>{dayjs(`${pageInfo.albumInfo.release_date}`).format('YYYY')}</p>
                                <p className='text-sm mx-1'>&bull;</p>
                                {pageInfo.albumInfo.total_tracks === 1 ?
                                    <p className='text-sm'>{pageInfo.albumInfo.total_tracks} song,</p>
                                    : <p className='text-sm'>{pageInfo.albumInfo.total_tracks} songs,</p>
                                }
                                <span className='text-spotify-light-gray text-sm font-semibold ml-1'>{duration}</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Album Song List Section */}
                <div className='flex flex-col'>
                    <div className='flex mt-6'>
                        <button className='text-spotify-green rounded-full'>
                            <BsFillPlayCircleFill size={50} className="ml-8 hover:scale-105" />
                        </button>
                        {isFollowed ?
                            <button onClick={() => handleRemoveFollow([albumId])}>
                                <HiHeart size={45} className="ml-8 text-spotify-green hover:scale-105" />
                            </button>
                            :
                            <button onClick={() => handleAddFollow([albumId])}>
                                <HiOutlineHeart size={45} className="ml-8 text-spotify-light-gray hover:scale-105 hover:text-white" />
                            </button>
                        }
                        <button onClick={() => setIsOpen(!isOpen)} className='m-2 inline-flex ml-8 text-spotify-light-gray'>
                            <BsThreeDots size={30} />
                        </button>
                        {isOpen &&
                            <div className='absolute bg-spotify-light-dark text-white mt-2 font-semibold rounded' onMouseLeave={() => setIsOpen(false)} onClick={() => setIsOpen(false)}>
                                <ul className='pt-2 pl-2 pb-2 pr-1 w-40'>
                                    {/* TODO: Da implementare */}
                                    <li className='hover:bg-spotify-gray rounded'>
                                        <button>Add to queue</button>
                                    </li>
                                    <li className='my-3 hover:bg-spotify-gray rounded'>
                                        <button className='border-b'
                                            onClick={() => handleAddFollow(pageInfo.playlist.id)}>Add to your library
                                        </button>
                                    </li>
                                    <li className='hover:bg-spotify-gray rounded'>
                                        <button onClick={handleShareLink}>Copy link to playlist</button>
                                    </li>
                                </ul>
                            </div>
                        }
                    </div>
                    <table className='table-auto border-separate border-spacing-y-3 pt-6 px-4'>
                        <UI.TrackLists.TrackListHeader />
                        {pageInfo.albumInfo.tracks.items.map((trackInfo, index) => {
                            return (
                                <UI.TrackLists.AlbumTrackList key={trackInfo.id} trackInfo={trackInfo} index={index} albumLikedSongs={albumLikedSongs[index]} setUpdateLikedSong={setUpdateLikedSong} updateLikedSong={updateLikedSong} albumId={albumId} />
                            )
                        })}
                    </table>
                    <p className='text-spotify-light-gray text-sm font-bold mt-6 ml-10'>{dayjs(pageInfo.albumInfo.release_date).format('MMMM D, YYYY')}</p>
                    {pageInfo.albumInfo.copyrights.map((copyright, index) => {
                        return (
                            <p key={index} className='text-spotify-light-gray text-[11px] font-semibold ml-10'>{copyright.text}</p>
                        )
                    })}
                </div>
                {/* Artist Popular Section */}
                <div className='flex flex-col mt-8'>
                    <p className="text-spotify-light-gray text-sm font-bold ml-10">Popular Tracks by</p>
                    <p className='text-white text-2xl font-bold ml-10'>{pageInfo.artistsInfo.artists[0].name}</p>
                    <table className='table-auto border-separate border-spacing-y-3 mt-3 mx-6'>
                        {pageInfo.artistTopTrack.map((trackInfo, index) => {
                            return (
                                <UI.TrackLists.TracksList key={trackInfo.id} index={index} trackInfo={trackInfo} likedSongs={likedSongs[index]} setUpdateLikedSong={setUpdateLikedSong} updateLikedSong={updateLikedSong} />
                            )
                        })}
                    </table>
                </div>
                {/* Fans Also Like section */}
                <div className='flex flex-col mx-8 mt-4'>
                    <div className='flex justify-between'>
                        <Link href={`/artist/${pageInfo.artistsInfo.artists[0].id}/related`}><p className='text-white text-2xl font-bold hover:underline'>Fans also like</p></Link>
                        <Link href={`/artist/${pageInfo.artistsInfo.artists[0].id}/related`}><p className='text-spotify-light-gray text-sm font-bold mt-2 mr-6 hover:underline'>Show all</p></Link>
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
                <ToastContainer />
            </div>
        )
    else return <LoadingPage />
}

export default AlbumPage