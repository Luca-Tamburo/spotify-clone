"use client"
// Imports
import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import dayjs from 'dayjs'
const axios = require('axios');
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useSession } from 'next-auth/react'

// Hooks
import useSpotify from '@/hooks/useSpotify'
import useNotification from '@/hooks/useNotification'
import useDuration from '@/hooks/useDuration'

// Components
import LoadingPage from '../../loading'

// Styles
import { BsPlayCircleFill, BsCheckCircleFill } from 'react-icons/bs'
import { TbCirclePlus } from 'react-icons/tb'
import { MdHideImage } from 'react-icons/md'

const EpisodePage = () => {
    const { data: session } = useSession();
    const spotifyApi = useSpotify();
    const notify = useNotification();
    const computeTime = useDuration();
    const pathname = usePathname();

    const [pageInfo, setPageInfo] = useState(undefined)
    const [duration, setDuration] = useState(undefined)
    const [isFollowed, setIsFollowed] = useState(false)
    const [loading, setLoading] = useState(true);

    const episodeId = pathname.split("/")[2]

    const handleAddLikeToEpisode = (episodeId) => {
        axios.put(`https://api.spotify.com/v1/me/episodes?ids=${episodeId}`, null, {
            headers: {
                'Authorization': `Bearer ${session.user.accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(() => {
            setIsFollowed(!isFollowed)
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
            setIsFollowed(!isFollowed)
            notify.success("Removed from Your Episodes")
        }).catch((err) => {
            notify.error("Error! Try again");
            console.log('Something went wrong!', err);
        });
    }


    useEffect(() => {
        const handleLoading = async () => {
            try {
                const episode = await spotifyApi.getEpisode(episodeId)

                const checkFollowEpisode = await axios.get(`https://api.spotify.com/v1/me/episodes/contains?ids=${episodeId}`, {
                    headers: {
                        'Authorization': `Bearer ${session.user.accessToken}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });


                setPageInfo(episode.body)
                setDuration(computeTime(episode.body.duration_ms))
                setLoading(false)
                setIsFollowed(checkFollowEpisode.data[0])

            } catch (err) {
                console.log('Something went wrong!', err);
            }
        }
        handleLoading();
    }, [isFollowed])

    if (!loading)
        return (
            <div className='flex flex-col bg-spotify-dark p-7'>
                {/* Episode Header Section */}
                <div className='flex'>
                    {pageInfo.images.length === 0 ? <MdHideImage size={150} className='pl-7' /> :
                        <Image
                            src={pageInfo.images[0].url}
                            alt='Episode Image'
                            width={640}
                            height={640}
                            className='w-52 h-52 rounded-lg' />
                    }
                    <div className='flex flex-col text-white font-bold ml-4'>
                        <p className='mt-10'>Episode</p>
                        <p className='text-3xl my-2'>{pageInfo.name}</p>
                        <div className='flex mt-7'>
                            <span className='text-xl'>{pageInfo.show.name}</span>
                            <span className='mx-1 mt-1'>&bull;</span>
                            <span className='mt-1'>{dayjs(pageInfo.release_date).format("DD MMM YYYY")}</span>
                            <span className='mx-1 mt-1'>&bull;</span>
                            <span className='mt-1'>{duration}</span>
                        </div>
                    </div>
                </div>
                {/* Episode Action Section */}
                <div className='flex mt-6'>
                    <button>
                        <BsPlayCircleFill size={50} className="text-spotify-green hover:scale-105" />
                    </button>
                    {
                        isFollowed ?
                            <button className='hover:text-white hover:scale-105' onClick={() => handleRemoveLikeToEpisode([episodeId])}>
                                <BsCheckCircleFill size={35} className='text-spotify-green mx-5' />
                            </button>
                            :
                            <button className='hover:text-white hover:scale-105' onClick={() => handleAddLikeToEpisode([episodeId])}>
                                <TbCirclePlus size={35} className='text-spotify-light-gray mx-5' />
                            </button>
                    }
                </div>
                {/* Episode Description Section */}
                <div className='flex flex-col mt-6'>
                    <p className='text-white font-bold text-2xl'>Episode Description</p>
                    <p className='text-spotify-light-gray font-semibold mt-6 w-1/2'>{pageInfo.description}</p>
                </div>
                <Link href={`/show/${pageInfo.show.id}`} className='text-white text-sm font-bold rounded-full border py-1 mt-6 w-32 hover:scale-105'>
                    <p className='pl-3'>See all episodes</p>
                </Link>
                <ToastContainer />
            </div>
        )
    else return <LoadingPage />
}

export default EpisodePage