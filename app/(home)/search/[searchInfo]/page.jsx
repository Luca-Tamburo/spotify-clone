"use client"

// Imports
import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Components
import LoadingPage from '../../loading'
import * as UI from '../../../../components/index'

// Hooks
import useSpotify from '@/hooks/useSpotify'

const SearchInfoPage = () => {
    const spotifyApi = useSpotify()
    const pathname = usePathname()

    const [pageInfo, setPageInfo] = useState(undefined)
    const [loading, setLoading] = useState(true)

    const searchId = pathname.split("/")[2]
    const artistName = searchId.charAt(0).toUpperCase() + searchId.slice(1)

    useEffect(() => {
        const handleLoading = async () => {
            try {

                const album = await spotifyApi.searchAlbums(searchId)
                const artist = await spotifyApi.searchArtists(searchId)
                const episodes = await spotifyApi.searchEpisodes(searchId)
                const playlist = await spotifyApi.searchPlaylists(searchId)
                const podcast = await spotifyApi.searchShows(searchId)

                const pageData = {
                    albumInfo: album.body.albums.items.slice(0, 6),
                    artistInfo: artist.body.artists.items.slice(0, 6),
                    episodesInfo: episodes.body.episodes.items.slice(0, 6),
                    playlistInfo: playlist.body.playlists.items.slice(0, 6),
                    podcastInfo: podcast.body.shows.items.slice(0, 6),
                }

                setLoading(false)
                setPageInfo(pageData)
            } catch (err) {
                console.log('Something went wrong!', err);
            }
        }
        handleLoading()
    }, [])

    if (!loading)
        return (
            <>
                {pageInfo.playlistInfo.length !== 0 && pageInfo.artistInfo.length !== 0 && pageInfo.albumInfo.length !== 0 && pageInfo.podcastInfo.length !== 0 && pageInfo.episodesInfo.length !== 0 ?
                    <div className='flex flex-col bg-spotify-dark p-8'>
                        {pageInfo.playlistInfo.length !== 0 &&
                            <>
                                <p className='text-white text-2xl font-bold mt-8'>Featuring {artistName}</p>
                                <div className='flex flex-wrap mt-2'>
                                    {pageInfo.playlistInfo.map((playlistInfo, index) => {
                                        return (
                                            <div key={playlistInfo.id} className='w-1/6'>
                                                <UI.Cards.PlaylistCard key={playlistInfo.id} playlistInfo={playlistInfo} />
                                            </div>
                                        )
                                    })}
                                </div>
                            </>
                        }
                        {pageInfo.artistInfo.length !== 0 &&
                            <>
                                <p className='text-white text-2xl font-bold mt-8'>Artist</p>
                                <div className='flex flex-wrap mt-2'>
                                    {pageInfo.artistInfo.map((artistInfo, index) => {
                                        return (
                                            <div key={artistInfo.id} className='w-1/6'>
                                                <UI.Cards.ArtistCard key={artistInfo.id} artistInfo={artistInfo} />
                                            </div>
                                        )
                                    })}
                                </div>
                            </>
                        }
                        {pageInfo.albumInfo.length !== 0 &&
                            <>
                                <p className='text-white text-2xl font-bold mt-8'>Albums</p>
                                <div className='flex flex-wrap mt-2'>
                                    {pageInfo.albumInfo.map((albumInfo, index) => {
                                        return (
                                            <div key={albumInfo.id} className='w-1/6'>
                                                <UI.Cards.AlbumCard key={albumInfo.id} albumInfo={albumInfo} />
                                            </div>
                                        )
                                    })}
                                </div>
                            </>
                        }
                        {pageInfo.podcastInfo.length !== 0 &&
                            <>
                                <p className='text-white text-2xl font-bold mt-8'>Podcasts</p>
                                <div className='flex flex-wrap mt-2'>
                                    {pageInfo.podcastInfo.map((podcastInfo, index) => {
                                        return (
                                            <div key={podcastInfo.id} className='w-1/6'>
                                                <UI.Cards.PodcastCard key={podcastInfo.id} podcastInfo={podcastInfo} />
                                            </div>
                                        )
                                    })}
                                </div>
                            </>
                        }
                        {pageInfo.episodesInfo.length !== 0 &&
                            <>
                                <p className='text-white text-2xl font-bold mt-8'>Episodes</p>
                                <div className='flex flex-wrap mt-2'>
                                    {pageInfo.episodesInfo.map((episodeInfo, index) => {
                                        return (
                                            <div key={episodeInfo.id} className='w-1/6'>
                                                <UI.Cards.EpisodeCard key={episodeInfo.id} episodeInfo={episodeInfo} />
                                            </div>
                                        )
                                    })}
                                </div>
                            </>
                        }
                    </div>
                    :
                    <div className='flex flex-col text-white font-bold bg-spotify-dark text-center items-center pt-10'>
                        <p className='text-3xl'>No results found for {searchId}</p>
                        <p>Please make sure your words are spelled correctly or use less or different keywords.</p>
                    </div>
                }
            </>
        )
    else return <LoadingPage />
}

export default SearchInfoPage