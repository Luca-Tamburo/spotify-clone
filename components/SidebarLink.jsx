"use client"
// Imports
import React, { useContext } from 'react'
import Link from 'next/link'
import Image from "next/image"
import { useRouter } from 'next/navigation'

// Hooks
import useSpotify from '@/hooks/useSpotify'

// Context
import { DataContext } from '@/contexts/DataContext'

// Icons
import { AiFillHome } from 'react-icons/ai'
import { BiLibrary } from 'react-icons/bi'
import { BsSearch, BsHeartFill, BsFillBookmarkFill } from 'react-icons/bs'
import { RiAddBoxFill } from 'react-icons/ri'

const SidebarLink = () => {
    const spotifyApi = useSpotify();
    const router = useRouter();
    const [updateSidebar, setUpdateSidebar] = useContext(DataContext)

    const handleCreatePlaylist = () => {
        spotifyApi.createPlaylist('My playlist', { 'description': 'My description', 'public': true })
            .then((data) => {
                setUpdateSidebar(!updateSidebar);
                router.push(`/playlist/${data.body.id}`);
            })
            .catch((err) => console.log('Something went wrong!', err))
    }



    return (
        <div className='mt-6'>
            <Link href="/" className="inline-block">
                <Image src="/assets/Logo_White.png" width={140} height={140} alt="Sidebar logo white" />
            </Link>
            <Link href="/" className="hover:text-white">
                <div className="flex mt-10">
                    <AiFillHome size={25} />
                    <p className="ml-4 mt-1 text-sm font-bold">Home</p>
                </div>
            </Link>
            <Link href="/search" className="hover:text-white">
                <div className="flex my-4">
                    <BsSearch size={25} />
                    <p className="ml-4 text-sm font-bold">Search</p>
                </div>
            </Link>
            <Link href="/collection/playlists" className="hover:text-white">
                <div className="flex mb-4">
                    <BiLibrary size={25} />
                    <p className="ml-4 text-sm font-bold">Your Library</p>
                </div>
            </Link>
            {/* TODO: Sistemare, inserendo come path, il l'url generato dall'onCLick del button */}
            <Link href="" className=" hover:text-white">
                <div className="flex hover:text-white mt-10" >
                    <RiAddBoxFill size={27} />
                    <button onClick={handleCreatePlaylist} className="ml-4 text-sm font-bold">Create Playlist</button>
                </div>
            </Link>
            <Link href="/collection/tracks" className="hover:text-white">
                <div className="flex hover:text-white mt-3" >
                    <BsHeartFill size={25} className="text-red-600" />
                    <p className="ml-4 text-sm font-bold">Liked Songs</p>
                </div>
            </Link>
            <Link href="/collection/episodes" className="hover:text-white">
                <div className="flex hover:text-white mt-3" >
                    <BsFillBookmarkFill size={25} className="text-spotify-green" />
                    <p className="ml-4 text-sm font-bold">Your Episodes</p>
                </div>
            </Link>
        </div>
    )
}

export default SidebarLink