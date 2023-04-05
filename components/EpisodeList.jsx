// Imports
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import dayjs from 'dayjs'
const axios = require('axios');
import { useSession } from "next-auth/react"

import copy from 'copy-to-clipboard';

// Hooks
import useNotification from '@/hooks/useNotification'

// Styles
import { BsPlayCircleFill, BsCheckCircleFill, BsThreeDots } from 'react-icons/bs'
import { TbShare2, TbCirclePlus } from 'react-icons/tb'

const EpisodeList = ({ episodeInfo, likedEpisodes, setUpdateLikedEpisodes, updateLikedEpisodes }) => {

    const { data: session } = useSession();
    const notify = useNotification();
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    const handleShareLink = () => {
        copy(`https://spotify-clone-six-beta.vercel.app/episode/${episodeInfo.id}`);
        notify.success("Link copied to clipboard")
    }

    const handleAddLikeToEpisode = (episodeId) => {
        axios.put(`https://api.spotify.com/v1/me/episodes?ids=${episodeId}`, null, {
            headers: {
                'Authorization': `Bearer ${session.user.accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(() => {
            setUpdateLikedEpisodes(!updateLikedEpisodes)
            notify.success("Added to Your Episodes")
        }).catch((err) => {
            notify.error("Error! Try again");
            console.log('Something went wrong!', err);
        });
    }

    const handleRemoveLikeToEpisode = (episodeId) => {
        axios({
            method: 'delete',
            url: `https://api.spotify.com/v1/me/episodes?ids=${episodeId}`,
            headers: {
                'Authorization': `Bearer ${session.user.accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        }).then(() => {
            setUpdateLikedEpisodes(!updateLikedEpisodes)
            notify.success("Removed from Your Episodes")
        }).catch((err) => {
            notify.error("Error! Try again");
            console.log('Something went wrong!', err);
        });

    }

    const minutes = Math.floor(episodeInfo.duration_ms / 60000);
    const seconds = Math.floor((episodeInfo.duration_ms % 60000) / 1000).toFixed(0);

    return (
        <div className='flex hover:bg-[#444444] p-3 rounded-lg' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Image
                src={episodeInfo.images[0].url}
                alt="Episode Image"
                width={300}
                height={300}
                className="w-28 h-28"
            />
            <div className='flex flex-col ml-4 w-10/12'>
                <Link href={`/episode/${episodeInfo.id}`}>
                    <p className='text-white font-bold hover:underline'>
                        {episodeInfo.name}
                    </p>
                </Link>
                {episodeInfo.show &&
                    <Link href={`/show/${episodeInfo.show.id}`}>
                        <p className='text-white font-bold hover:underline'>
                            {episodeInfo.show.name}
                        </p>
                    </Link>
                }
                <p className='text-sm truncate text-spotify-light-gray font-semibold my-2'>{episodeInfo.description}</p>
                <div className='flex justify-between mt-4'>
                    <div className='flex'>
                        <button className='hover:scale-105 mr-7'>
                            <BsPlayCircleFill size={35} className='text-white' />
                        </button>
                        <p className='text-sm text-spotify-light-gray font-semibold mt-2'>{dayjs(`${episodeInfo.release_date}`).format('MMM D')}</p>
                        <p className='text-spotify-light-gray mx-1 mb-2 mt-2'>&bull;</p>
                        <p className='text-sm text-spotify-light-gray font-semibold mt-2'>{minutes} min {seconds} sec</p>
                    </div>
                    <div className='flex'>
                        <button className='hover:text-white hover:scale-105' onClick={handleShareLink}>
                            <TbShare2 size={25} className={`${isHovering ? "opacity-100" : "opacity-0"} text-spotify-light-gray`} />
                        </button>
                        {
                            likedEpisodes ?
                                <button className='hover:text-white hover:scale-105' onClick={() => handleRemoveLikeToEpisode([episodeInfo.id])}>
                                    <BsCheckCircleFill size={25} className='text-spotify-green mx-5' />
                                </button>
                                :
                                <button className='hover:text-white hover:scale-105' onClick={() => handleAddLikeToEpisode([episodeInfo.id])}>
                                    <TbCirclePlus size={25} className='text-spotify-light-gray mx-5' />
                                </button>
                        }
                        <button className='hover:text-white hover:scale-105'>
                            <BsThreeDots size={25} className={`${isHovering ? "opacity-100" : "opacity-0"} text-spotify-light-gray`} />
                        </button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default EpisodeList