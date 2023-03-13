// Imports
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

// Styles
import { BsFillPlayCircleFill } from 'react-icons/bs'

const ArtistCard = ({ artistInfo }) => {
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseEnter = () => {
        setIsHovering(true);
    }

    const handleMouseLeave = () => {
        setIsHovering(false);
    }

    return (
        <div className='relative bg-spotify-semi-light-dark hover:bg-spotify-light-dark h-64 w-44 rounded-lg' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Link href={`/artist/${artistInfo.id}`}>
                <Image
                    src={artistInfo.images[1].url}
                    alt="Card Image"
                    width={300}
                    height={300}
                    className="rounded-full p-3"
                />
                <p className='text-white font-bold mt-3 ml-4'>{artistInfo.name}</p>
                <p className='text-sm text-spotify-light-gray font-semibold mt-1 ml-4'>{artistInfo.type.charAt(0).toUpperCase() + artistInfo.type.slice(1)}</p>
                {isHovering &&
                    <button>
                        <BsFillPlayCircleFill size={50} className='absolute top-28 left-28 text-spotify-green bg-black rounded-full hover:scale-105 ' />
                    </button>
                }
            </Link>
        </div>
    )
}

export default ArtistCard