"use client"

// Imports
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Hooks
import useSpotify from '@/hooks/useSpotify';

// Components
import Loading from '@/app/(home)/loading';
import * as UI from '@/components/index';

// Styles
import { MdHideImage } from 'react-icons/md';

const UserPage = () => {
    const { data: session } = useSession();
    const spotifyApi = useSpotify();
    const pathname = usePathname();

    const userId = pathname.split("/")[2]

    const [aboutMe, setAboutMe] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [updateLikedSong, setUpdateLikedSong] = useState(true);

    useEffect(() => {
        const handleLoading = async () => {
            try {
                const me = await spotifyApi.getUser(userId);
                const playlists = await spotifyApi.getUserPlaylists(userId);

                const myTopArtists = await spotifyApi.getMyTopArtists({ limit: 6 });
                const myTopTracks = await spotifyApi.getMyTopTracks({ limit: 4 });

                const personalData = {
                    userInfo: me.body,
                    userPlaylists: playlists.body.items.filter(status => status.public === true).slice(0, 6),
                    userTopArtists: session.user.username === userId && myTopArtists.body.items,
                    userTopTracks: session.user.username === userId && myTopTracks.body.items,
                }

                setAboutMe(personalData)
                setLoading(false);
            } catch (err) {
                console.log('Something went wrong!', err);
            }
        }

        handleLoading();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!loading)
        return (
            <>
                {/* User info section */}
                <div className='flex bg-gradient-to-t from-spotify-light-dark to-spotify-gray p-6'>
                    {aboutMe.userInfo.images.length === 0 ? <MdHideImage /> :
                        <Image
                            src={aboutMe.userInfo.images[0].url}
                            alt="User profile image"
                            width={250}
                            height={250}
                            style={{ borderRadius: '50%' }}
                            className="shadow-2xl shadow-spotify-dark"
                        />
                    }
                    <div className='text-white mt-20 ml-5'>
                        <div className='font-bold'>
                            <p className='text-xs'>PROFILE</p>
                            <p className='text-7xl mt-4'>{aboutMe.userInfo.display_name}</p>
                        </div>
                        <div className='flex text-sm font-semibold mt-8'>
                            <p>{aboutMe.userPlaylists.length} Public Playlists</p>
                            <span>&nbsp; &bull;</span>
                            <p className='mx-3'>{aboutMe.userInfo.followers.total} Followers</p>
                        </div>
                    </div>
                </div>
                {/* Top artists section*/}
                {session.user.username === userId &&
                    <div className='flex flex-col bg-spotify-dark pt-6 px-4'>
                        <div className='flex justify-between ml-2 mr-7'>
                            <Link href={`/user/${aboutMe.userInfo.id}/top/artists`}>
                                <p className='text-white font-bold text-xl hover:underline'>Top artists this month</p>
                            </Link>
                            <Link href={`/user/${aboutMe.userInfo.id}/top/artists`}>
                                <p className='text-spotify-light-gray font-bold hover:underline'>Show all</p>
                            </Link>
                        </div>
                        <p className='text-spotify-light-gray text-sm font-semibold mt-1 ml-2'>Only visible to you</p>
                        <div className='flex flex-wrap mt-4'>
                            {aboutMe.userTopArtists.map((artistInfo, index) => {
                                return (
                                    <div className='w-1/6 px-2' key={artistInfo.id}>
                                        <UI.Cards.ArtistCard key={artistInfo.id} artistInfo={artistInfo} />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                }
                {/* Top tracks section  */}
                {session.user.username === userId &&
                    <div className='flex flex-col bg-spotify-dark pt-6 px-4'>
                        <div className='flex justify-between ml-2 mr-7'>
                            <Link href={`/user/${aboutMe.userInfo.id}/top/tracks`}>
                                <p className='text-white font-bold text-xl hover:underline'>Top tracks this month</p>
                            </Link>
                            <Link href={`/user/${aboutMe.userInfo.id}/top/tracks`}>
                                <p className='text-spotify-light-gray font-bold hover:underline'>Show all</p>
                            </Link>
                        </div>
                        <p className='text-spotify-light-gray text-sm font-semibold mt-1 ml-2'>Only visible to you</p>
                        <div className='mt-4 mx-3'>
                            <table className='w-full table-auto border-separate border-spacing-y-3'>
                                {aboutMe.userTopTracks.map((trackInfo, index) => {
                                    return (
                                        <UI.TrackLists.TracksList key={trackInfo.id} trackInfo={trackInfo} index={index} updateLikedSong={updateLikedSong} setUpdateLikedSong={setUpdateLikedSong} />
                                    )
                                })}
                            </table>
                        </div>
                    </div>
                }
                {/* Public Playlists section */}
                <div className='flex flex-col bg-spotify-dark pt-6 px-4'>
                    <div className='flex justify-between'>
                        <Link href={`/user/${userId}/playlists`}>
                            <p className='text-white font-bold text-2xl'>Public Playlists</p>
                        </Link>
                        <Link href={`/user/${userId}/playlists`}>
                            <p className='text-spotify-light-gray text-sm font-bold mt-2 mr-6 hover:underline'>Show all</p>
                        </Link>
                    </div>
                    <div className='flex flex-wrap mt-4'>
                        {aboutMe.userPlaylists.map((playlistInfo, index) => {
                            return (
                                <div className='w-1/6 px-2 mt-2' key={playlistInfo.id}>
                                    <UI.Cards.PlaylistCard key={playlistInfo.id} playlistInfo={playlistInfo} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </>
        )
    else return <Loading />
}

export default UserPage