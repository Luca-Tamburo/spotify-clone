// Imports

import React, { useState } from 'react'
import Link from 'next/link';

// Hooks
import useSpotify from '@/hooks/useSpotify';
import useNotification from '@/hooks/useNotification';

// Styles
import { TbSquareLetterE } from 'react-icons/tb'
import { BsHeartFill, BsHeart, BsFillPlayFill } from 'react-icons/bs'

const AlbumTracksList = ({ index, trackInfo, albumLikedSongs, setUpdateLikedSong, updateLikedSong }) => {
    const spotifyApi = useSpotify();
    const notify = useNotification();

    const [isHovering, setIsHovering] = useState(false);

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    const handleAddLikeToSong = (trackId) => {
        spotifyApi.addToMySavedTracks(trackId)
            .then(() => {
                notify.success("Added to Your Liked Songs");
                setUpdateLikedSong(!updateLikedSong);
            })
            .catch((err) => {
                notify.error("Error! Try again");
                console.log('Something went wrong!', err);
            })
    }

    const handleRemoveLikeToSong = (trackId) => {
        spotifyApi.removeFromMySavedTracks(trackId)
            .then(() => {
                notify.success("Removed from Your Liked Songs")
                setUpdateLikedSong(!updateLikedSong);
            })
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
                </td>
                <td>
                    {albumLikedSongs ?
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

export default AlbumTracksList