"use client"
// Importsz
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Components
import LoadingPage from '@/app/(home)/loading'
import * as UI from '../../../../../../components/index'

// Hooks
import useSpotify from '@/hooks/useSpotify'

const DiscographyPage = () => {
    const spotifyApi = useSpotify()
    const pathname = usePathname()

    const [pageInfo, setPageInfo] = useState(undefined)
    const [loading, setLoading] = useState(true)

    const artistId = pathname.split("/")[2]

    useEffect(() => {
        const handleLoading = async () => {
            try {
                const artist = await spotifyApi.getArtist(artistId)
                const albums = await spotifyApi.getArtistAlbums(artistId)

                const pageData = {
                    artistInfo: artist.body,
                    artistAlbum: albums.body.items
                }

                setPageInfo(pageData)
                setLoading(false)
            } catch (err) {
                console.log('Something went wrong!', err);
            }
        }

        handleLoading();
    }, [])

    if (!loading)
        return (
            <div className='p-8 bg-spotify-dark'>
                <Link href={`/artist/${artistId}`}>
                    <p className='text-white text-2xl font-bold hover:underline'>{pageInfo.artistInfo.name}</p>
                    <div className='flex flex-wrap'>
                        {pageInfo.artistAlbum.map((albumInfo, index) => {
                            return (
                                <div key={albumInfo.id} className='w-1/6 mt-4'>
                                    <UI.Cards.AlbumCard albumInfo={albumInfo} />
                                </div>
                            )
                        })}
                    </div>
                </Link>
            </div>
        )
    else return <LoadingPage />
}

export default DiscographyPage