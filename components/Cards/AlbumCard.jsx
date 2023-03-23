// Imports
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

// Styles
import { BsFillPlayCircleFill } from 'react-icons/bs'
import { MdHideImage } from 'react-icons/md'

const AlbumCard = ({ albumInfo }) => {

    const [isHovering, setIsHovering] = useState(false);

    const handleMouseEnter = () => {
        setIsHovering(true);
    }

    const handleMouseLeave = () => {
        setIsHovering(false);
    }
    return (
        <div className='relative bg-spotify-semi-light-dark h-60 w-44 rounded-lg hover:bg-spotify-light-dark' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Link href={`/album/${albumInfo.album.id}`}>
                {albumInfo.album.images.length === 0 ? <MdHideImage size={150} className="pl-6" /> :
                    <Image
                        src={albumInfo.album.images[0].url}
                        alt="Card Image"
                        width={300}
                        height={300}
                        className='px-4 py-3 h-4/6'
                    />
                }
                <p className='truncate text-white font-bold ml-4 my-2'>{albumInfo.album.name}</p>
                <div className='flex ml-4'>
                    {albumInfo.album.artists.length === 1 ?
                        albumInfo.album.artists.map((artist, index) => {
                            return (
                                <Link href={`/artist/${artist.id}`} key={artist.id} className="hover:underline">
                                    <p className='text-spotify-light-gray text-sm font-semibold hover:underline'>{artist.name}</p>
                                </Link>
                            )
                        }) : albumInfo.album.artists.map((artist, index) => {
                            return (
                                <Link href={`/artist/${artist.id}`} key={artist.id} className="hover:underline">
                                    <p className='text-spotify-light-gray text-sm font-semibold hover:underline'>{artist.name}{index !== albumInfo.album.artists.length - 1 ? ",\u00a0" : ""}</p>
                                </Link>
                            )
                        })
                    }
                </div>
            </Link>
            {isHovering &&
                <button>
                    <BsFillPlayCircleFill size={45} className='absolute top-28 left-28 text-spotify-green bg-black rounded-full hover:scale-105' />
                </button>
            }
        </div>
    )
}

export default AlbumCard
