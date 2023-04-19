"use client"
// Importsz
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Components
import LoadingPage from '@/app/(home)/loading'
import * as UI from '@/components/index'

// Hooks
import useSpotify from '@/hooks/useSpotify'

const AppearOnpage = () => {
    const spotifyApi = useSpotify()
    const pathname = usePathname()

    const [pageInfo, setPageInfo] = useState(undefined)
    const [loading, setLoading] = useState(true)

    const artistId = pathname.split("/")[2]

    useEffect(() => {
        const handleLoading = async () => {
            try {
                const album = await spotifyApi.getArtistAlbums(artistId)

                const pageData = {
                    appearsOn: album.body.items.filter(it => it.album_group === "appears_on"),
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
                <p className='text-white text-2xl font-bold hover:underline'>Appears On</p>
                <Link href={`/album/${pageInfo.appearsOn.id}`}>
                    <div className='flex flex-wrap'>
                        {pageInfo.appearsOn.map((albumInfo, index) => {
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

export default AppearOnpage