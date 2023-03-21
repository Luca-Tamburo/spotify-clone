"use client"
// Imports
import React, { useState, useEffect } from "react";

// Hooks
import useSpotify from "@/hooks/useSpotify";
import useGreeting from "@/hooks/useGreeting";

// Components
import LoadingPage from "./loading";
import * as UI from '../../components/index'

// Styles

const Home = () => {
  const spotifiApi = useSpotify();
  const [loading, setLoading] = useState(true)
  const [suggestedPlaylists, setSuggestedPlaylists] = useState(undefined)
  const greeting = useGreeting();

  useEffect(() => {
    const handleLoading = async () => {
      try {
        const featPlaylists = await spotifiApi.getFeaturedPlaylists({ limit: 6, country: 'IT' })
        const newReleases = await spotifiApi.getNewReleases({ limit: 50, country: 'IT' })

        const playlists = {
          "featuredPlaylists": featPlaylists.body.playlists.items,
          "newReleases": newReleases.body.albums.items
        }

        setSuggestedPlaylists(playlists);
        setLoading(false);
      } catch (err) {
        console.log('Something went wrong!', err);
      }
    }

    handleLoading();
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!loading)
    return (
      <div className="bg-spotify-dark text-white px-8 pt-4">
        <p className="text-4xl font-bold ml-1">{greeting}</p>
        <p className="text-2xl font-bold mt-4 ml-2">Selected For You</p>
        {/* Featured playlists section */}
        <div className="flex flex-wrap mt-4">
          {suggestedPlaylists.featuredPlaylists.map((playlistInfo, index) => {
            return (
              <div className='w-1/6 px-2' key={playlistInfo.id}>
                <UI.Cards.PlaylistCard key={playlistInfo.id} playlistInfo={playlistInfo} />
              </div>
            )
          })}
        </div>
        {/* New Release playlists section */}
        <p className="text-2xl font-bold mt-6 ml-2">New Releases</p>
        <div className="flex flex-wrap mt-1">
          {/* TODO: Fare un componente albumCard che abbia il link component a /album */}
          {suggestedPlaylists.newReleases.map((playlistInfo, index) => {
            return (
              <div className='w-1/6 px-2 mt-4' key={playlistInfo.id}>
                <UI.Cards.PlaylistCard key={playlistInfo.id} playlistInfo={playlistInfo} />
              </div>
            )
          })}
        </div>
      </div>
    )
  else return <LoadingPage />
}

export default Home;