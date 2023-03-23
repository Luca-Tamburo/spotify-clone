// Imports
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

// Styles
import { MdHideImage } from 'react-icons/md'

const PodcastCard = ({ podcastInfo }) => {

    return (
        <div className='relative bg-spotify-semi-light-dark h-60 w-44 rounded-lg hover:bg-spotify-light-dark'>
            <Link href={`/show/${podcastInfo.show.id}`}>
                {podcastInfo.show.images.length === 0 ? <MdHideImage size={150} className="pl-6" /> :
                    <Image
                        src={podcastInfo.show.images[0].url}
                        alt="Card Image"
                        width={300}
                        height={300}
                        className='px-4 py-3 h-4/6'
                    />
                }
                <p className='truncate text-white font-bold ml-4 mt-1 mb-2'>{podcastInfo.show.name}</p>
                <p className='text-spotify-light-gray text-sm font-semibold ml-4'>{podcastInfo.show.publisher}</p>
            </Link>
        </div>
    )
}

export default PodcastCard
