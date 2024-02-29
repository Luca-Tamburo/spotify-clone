// Imports

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link';
import copy from 'copy-to-clipboard';

// Hooks
import useSpotify from '@/hooks/useSpotify';
import useNotification from '@/hooks/useNotification';

// Styles
import { TbSquareLetterE } from 'react-icons/tb'
import { BsHeartFill, BsHeart, BsFillPlayFill, BsThreeDots } from 'react-icons/bs'

const TracksList = ({ index, trackInfo, likedSongs, setUpdateLikedSong, updateLikedSong, isOwner, playlistId, updatePlaylist, setUpdatePlaylist }) => {

    const spotifyApi = useSpotify();
    const notify = useNotification();

    const [isHovering, setIsHovering] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

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

    const handleShareLink = () => {
        copy(`https://spotify-clone-six-beta.vercel.app/track/${trackInfo.id}`);
        notify.success("Link copied to clipboard")
    }

    const handleRemoveSong = (trackId) => {
        spotifyApi.removeTracksFromPlaylist(playlistId, [{ uri: `spotify:track:${trackId}` }])
            .then(() => {
                notify.success("Removed from this playlist")
                setUpdatePlaylist(!updatePlaylist)
            })
            .catch((err) => console.log(err))
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
                            <Link href={`/track/${trackInfo.id}`} key={trackInfo.id} className="hover:underline">
                                <p className='text-white'>{trackInfo.name}</p>
                            </Link>
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
                        <button className={`${isHovering ? "opacity-100" : "opacity-0"} mr-4`} onClick={() => handleAddLikeToSong([trackInfo.id])}>
                            <BsHeart />
                        </button>
                    }
                </td>
                <td className='flex mt-2'>
                    <p className='mr-6'>{`${minutes}:${seconds}`}</p>
                    <button className={`${isHovering ? "opacity-100" : "opacity-0"} mr-10`} onClick={() => setIsOpen(!isOpen)}>
                        <BsThreeDots />
                    </button>
                    {isOpen &&
                        <div className='absolute bg-spotify-light-dark text-white mt-2 font-semibold rounded' onMouseLeave={() => setIsOpen(false)} onClick={() => setIsOpen(false)}>
                            <ul className='m-3 pt-1'>
                                {/* TODO: Da implementare */}
                                <li className='border-b hover:bg-spotify-gray'>Add to queue</li>
                                {trackInfo.artists.map((artist, index) => {
                                    return (
                                        <li key={artist.id} className='hover:bg-spotify-gray my-1'>
                                            <Link href={`/artist/${artist.id}`}>
                                                Go to <span className='italic'>{artist.name}</span> page
                                            </Link>
                                        </li>
                                    )
                                })}
                                <li className='hover:bg-spotify-gray'><Link href={`/album/${trackInfo.album.id}`}>Go to album</Link></li>
                                <li className='hover:bg-spotify-gray my-1 border-t'>
                                    {!likedSongs ?
                                        <button onClick={() => handleAddLikeToSong([trackInfo.id])}>Save to your Liked Songs</button>
                                        :
                                        <button onClick={() => handleRemoveLikeToSong([trackInfo.id])}>Remove from your Liked Songs</button>
                                    }
                                </li>
                                {isOwner && <li className='hover:bg-spotify-gray my-1'><button onClick={() => handleRemoveSong(trackInfo.id)}>Remove from this playlist</button></li>}
                                <li className='hover:bg-spotify-gray border-t border-b'><button onClick={handleShareLink}>Copy song link</button></li>
                            </ul>
                        </div>
                    }
                </td>
            </tr>
        </tbody>
    )
}

export default TracksList