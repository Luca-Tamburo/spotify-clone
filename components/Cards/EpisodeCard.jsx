// Imports

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import dayjs from 'dayjs'

// Styles
import { MdHideImage } from 'react-icons/md'

const EpisodeCard = ({ episodeInfo }) => {

    const minutes = Math.floor(episodeInfo.duration_ms / 60000) + 1;
    const date = dayjs(episodeInfo.release_date).format("MMM YYYY")

    return (
        <div className='relative bg-spotify-semi-light-dark h-60 w-44 rounded-lg hover:bg-spotify-light-dark'>
            <Link href={`/episode/${episodeInfo.id}`}>
                {episodeInfo.images.length === 0 ? <MdHideImage size={150} className="pl-6" /> :
                    <Image
                        src={episodeInfo.images[0].url}
                        alt="Card Image"
                        width={300}
                        height={300}
                        className='px-4 py-3 h-4/6'
                    />
                }
                <p className='truncate text-white font-bold ml-4 mt-1 mb-2'>{episodeInfo.name}</p>
                <span className='text-spotify-light-gray text-sm font-semibold ml-4'>{date}</span>
                <span className='mx-1 text-spotify-light-gray'>&bull;</span>
                <span className='text-spotify-light-gray text-sm font-semibold'>{minutes} Min</span>
            </Link>
        </div>
    )
}

export default EpisodeCard
