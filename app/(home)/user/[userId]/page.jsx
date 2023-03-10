"use client"

// Imports
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

// Hooks
import useSpotify from '@/hooks/useSpotify';

// Components
import Loading from '@/app/(home)/loading';
import * as UI from '@/components/index';

const UserPage = () => {
    const { data: session } = useSession();
    const spotifyApi = useSpotify();
    const [aboutMe, setAboutMe] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleLoading = async () => {
            try {
                const me = await spotifyApi.getMe();
                const playlists = await spotifyApi.getUserPlaylists(`${session.user.username}`);
                const myTopArtists = await spotifyApi.getMyTopArtists({ limit: 6 });
                const myTopTracks = await spotifyApi.getMyTopTracks({ limit: 4 });

                const personalData = {
                    userInfo: me.body,
                    userPlaylists: playlists.body.items.filter(it => it.owner.id === session.user.username),
                    userPlaylistsCounter: playlists.body.items.filter(it => it.owner.id === session.user.username).length,
                    userTopArtists: myTopArtists.body.items,
                    userTopTracks: myTopTracks.body.items.map(track => ({
                        "album": {
                            "id": track.album.id,
                            "name": track.album.name,
                            "image": track.album.images[2].url,
                        },
                        "song": {
                            "name": track.name,
                            "image": track.album.images[2].url,
                            "duration": track.duration_ms,
                        },
                        "artists": track.artists.map(artist => ({
                            "id": artist.id,
                            "name": artist.name,
                        })),
                        "explicit": track.explicit,
                        "type": track.album.type
                    }))
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
                    <Image
                        src={session.user.image}
                        alt="User profile image"
                        width={250}
                        height={250}
                        style={{ borderRadius: '50%' }}
                        className="shadow-2xl shadow-spotify-dark"
                    />
                    <div className='text-white mt-20 ml-5'>
                        <div className='font-bold'>
                            <p className='text-xs'>PROFILE</p>
                            <p className='text-7xl mt-4'>{aboutMe.userInfo.display_name}</p>
                        </div>
                        <div className='flex text-sm font-semibold mt-8'>
                            <p>{aboutMe.userPlaylistsCounter} Public Playlists</p>
                            <span>&nbsp; &bull;</span>
                            <p className='mx-3'>{aboutMe.userInfo.followers.total} Followers</p>
                        </div>
                    </div>
                </div>
                {/* Top artists section*/}
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
                                    <UI.ArtistCard key={artistInfo.id} artistInfo={artistInfo} />
                                </div>
                            )
                        })}
                    </div>
                </div>
                {/* Top tracks section  */}
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
                                    <UI.TracksList key={trackInfo.id} trackInfo={trackInfo} index={index} />
                                )
                            })}
                        </table>
                    </div>
                </div>
                {/* Public Playlists section */}
                <div className='flex flex-col bg-spotify-dark pt-6 px-4'>
                    <p className='text-white font-bold text-2xl'>Public Playlists</p>
                    <div className='flex flex-wrap mt-4'>
                        {aboutMe.userPlaylists.map((playlistInfo, index) => {
                            return (
                                <div className='w-1/6 px-2' key={playlistInfo.id}>
                                    <UI.PlaylistCard key={playlistInfo.id} playlistInfo={playlistInfo} />
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