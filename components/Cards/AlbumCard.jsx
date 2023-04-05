// Imports
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import dayjs from 'dayjs'

// Styles
import { BsFillPlayCircleFill } from 'react-icons/bs'
import { MdHideImage } from 'react-icons/md'

const AlbumCard = ({ albumInfo }) => {
    const pathname = usePathname()
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseEnter = () => {
        setIsHovering(true);
    }

    const handleMouseLeave = () => {
        setIsHovering(false);
    }

    const isArtistPath = pathname.split("/")[1]

    return (
        <div className='relative bg-spotify-semi-light-dark h-60 w-44 rounded-lg hover:bg-spotify-light-dark' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Link href={`/album/${albumInfo.id}`}>
                {albumInfo.images.length === 0 ? <MdHideImage size={150} className="pl-6" /> :
                    <Image
                        src={albumInfo.images[0].url}
                        alt="Card Image"
                        width={300}
                        height={300}
                        className='px-4 py-3 h-4/6'
                    />
                }
                <p className='truncate text-white font-bold ml-4 my-2'>{albumInfo.name}</p>
                {!isArtistPath === "artist" ?
                    <div className='flex ml-4'>
                        {albumInfo.artists.length === 1 ?
                            albumInfo.artists.map((artist, index) => {
                                return (
                                    <Link href={`/artist/${artist.id}`} key={artist.id} className="hover:underline">
                                        <p className='text-spotify-light-gray text-sm font-semibold hover:underline'>{artist.name}</p>
                                    </Link>
                                )
                            }) : albumInfo.artists.map((artist, index) => {
                                return (
                                    <Link href={`/artist/${artist.id}`} key={artist.id} className="hover:underline">
                                        <p className='text-spotify-light-gray text-sm font-semibold hover:underline'>{artist.name}{index !== albumInfo.artists.length - 1 ? ",\u00a0" : ""}</p>
                                    </Link>
                                )
                            })
                        }
                    </div>
                    :
                    <div className='flex ml-4'>
                        <p className='text-spotify-light-gray text-sm font-semibold'>{dayjs(albumInfo.release_date).format('YYYY')}</p>
                        <p className='text-spotify-light-gray text-sm font-semibold mx-1'>&bull;</p>
                        <p className='text-spotify-light-gray text-sm font-semibold'>{albumInfo.album_type.charAt(0).toUpperCase() + albumInfo.album_type.slice(1)}</p>
                    </div>
                }
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
