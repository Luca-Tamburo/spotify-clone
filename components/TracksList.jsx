// Imports
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'

const TracksList = ({ index, trackInfo }) => {

    const totalSeconds = Math.floor(trackInfo.song.duration / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return (
        <tbody className='text-spotify-light-gray font-semibold hover:text-white hover:bg-spotify-light-dark'>
            <tr>
                <td className='text-lg pl-6 py-4'>{index + 1}</td>
                <td>
                    <div className='flex'>
                        <Image
                            src={trackInfo.type.toLowerCase() === "album" ? trackInfo.album.image : trackInfo.song.image}
                            alt={trackInfo.type.toLowerCase() === "album" ? "Album Image" : "Song Image"}
                            width={45}
                            height={50}
                            className="mr-3"
                        />
                        <div className='flex flex-col'>
                            <p className='text-white'>{trackInfo.song.name}</p>
                            <div className='flex'>
                                {/* TODO: Trovare un'icona con la E */}
                                {/* <TbCircleLetterE /> */}
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
                                                <p className='text-spotify-light-gray hover:underline'>{artist.name}{index !== trackInfo.artists.length - 1 ? ',' : ''}</p>
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
                <td><p>{`${minutes}:${seconds}`}</p></td>
            </tr>
        </tbody>
    )
}

export default TracksList