// Imports
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

// Styles
import { BsFillPlayCircleFill } from 'react-icons/bs'
import { MdHideImage } from 'react-icons/md'

const PlaylistCard = ({ playlistInfo }) => {
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseEnter = () => {
        setIsHovering(true);
    }

    const handleMouseLeave = () => {
        setIsHovering(false);
    }
    return (
        <div className='relative bg-spotify-semi-light-dark h-64 w-44 rounded-lg hover:bg-spotify-light-dark' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Link href={`/playlist/${playlistInfo.id}`}>
                {/* CAPIRE SE SI PUÒ METTERE UN'ICONA O NO. */}
                {playlistInfo.images.length === 0 ? <MdHideImage size={150} className="pl-6" /> :
                    <Image
                        src={playlistInfo.images[0].url}
                        alt="Card Image"
                        width={300}
                        height={300}
                        className='px-4 py-2 h-3/5'
                    />
                }
                <p className='truncate text-white font-bold ml-4'>{playlistInfo.name}</p>
                {playlistInfo.artistInfo &&
                    playlistInfo.artistInfo.map((artist, index) => {
                        return (
                            <div key={artist.id} className='ml-4'>
                                <Link href={`/artist/${artist.id}`}>
                                    <p className='text-sm text-spotify-light-gray font-semibold mt-1 hover:underline'>{artist.name}</p>
                                </Link>
                            </div>
                        )
                    })
                }
                {playlistInfo.type && <p className='text-sm text-spotify-light-gray font-semibold mt-1 ml-4'>{playlistInfo.type.charAt(0).toUpperCase() + playlistInfo.type.slice(1)}</p>}
                {playlistInfo.description && <p className='text-sm truncate text-spotify-light-gray font-semibold mt-1 ml-4'>{playlistInfo.description}</p>}
            </Link>
            {isHovering &&
                <button>
                    <BsFillPlayCircleFill size={45} className='absolute top-28 left-28 text-spotify-green bg-black rounded-full hover:scale-105' />
                </button>
            }
        </div>
    )
}

export default PlaylistCard
