"use client"
// Imports

import React, { useState, useContext } from 'react'
import Image from 'next/image'
import Link from 'next/link';

// Context
import { DataContext } from '@/contexts/DataContext';

// Hooks
import useSpotify from '@/hooks/useSpotify';
import useNotification from '@/hooks/useNotification';

// Styles
import { TbSquareLetterE } from 'react-icons/tb'
import { BsHeartFill, BsHeart, BsFillPlayFill } from 'react-icons/bs'

const TracksList = ({ index, trackInfo, likedSongs }) => {
    const spotifyApi = useSpotify();
    const notify = useNotification();

    const [isHovering, setIsHovering] = useState(false);
    const [updateLikedSong, setUpdateLikedSong] = useContext(DataContext)

    const handleMouseEnter = () => {
        setIsHovering(true);
        setUpdateLikedSong(!updateLikedSong);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        setUpdateLikedSong(!updateLikedSong);
    };

    const handleAddLikeToSong = (trackId) => {
        spotifyApi.addToMySavedTracks(trackId)
            .then(() => notify.success("Added to Your Liked Songs"))
            .catch((err) => {
                notify.error("Error! Try again");
                console.log('Something went wrong!', err);
            })
    }

    const handleRemoveLikeToSong = (trackId) => {
        spotifyApi.removeFromMySavedTracks(trackId)
            .then(() => notify.success("Removed from Your Liked Songs"))
            .catch((err) => {
                notify.error("Error! Try again");
                console.log('Something went wrong!', err);
            })
    }

    const totalSeconds = Math.floor(trackInfo.duration_ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return (
        <tbody className='text-spotify-light-gray font-semibold hover:text-white hover:bg-[#444444]' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <tr>
                <td className='pl-6'>
                    {isHovering ? <button className='mt-1'> <BsFillPlayFill size={21} /> </button> : <span className='text-lg py-4'>{index + 1}</span>}
                </td>
                <td>
                    <div className='flex'>
                        <Image
                            src={trackInfo.album.images[2].url}
                            alt="Album Image"
                            width={45}
                            height={50}
                            className="mr-3"
                        />
                        <div className='flex flex-col'>
                            <p className='text-white'>{trackInfo.name}</p>
                            <div className='flex'>
                                {trackInfo.explicit && <TbSquareLetterE className='mt-1 mr-2' size={18} />}
                                {trackInfo.artists.length === 1 ?
                                    trackInfo.artists.map((artist, index) => {
                                        return (
                                            <Link href={`/artist/${artist.id}`} key={artist.id} className="hover:underline">
                                                <p>{artist.name}</p>
                                            </Link>
                                        )
                                    }) : trackInfo.artists.map((artist, index) => {
                                        return (
                                            <Link href={`/artist/${artist.id}`} key={artist.id} className="hover:underline">
                                                <p className='text-spotify-light-gray hover:underline'>{artist.name}{index !== trackInfo.artists.length - 1 ? ",\u00a0" : ""}</p>
                                            </Link>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <Link href={`/album/${trackInfo.album.id}`} key={trackInfo.album.id} className="hover:underline">
                        {trackInfo.album.name}
                    </Link>
                </td>
                <td>
                    {likedSongs ?
                        <button onClick={() => handleRemoveLikeToSong([trackInfo.id])}>
                            <BsHeartFill className='text-spotify-green' />
                        </button>
                        :
                        <button className={`${isHovering ? "opacity-100" : "opacity-0"} mr-10`} onClick={() => handleAddLikeToSong([trackInfo.id])}>
                            <BsHeart />
                        </button>
                    }
                </td>
                <td>
                    <p className=' mr-6'>{`${minutes}:${seconds}`}</p>
                </td>
            </tr>
        </tbody>
    )
}

export default TracksList