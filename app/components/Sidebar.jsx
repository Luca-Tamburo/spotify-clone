// Imports
import Link from "next/link"
import Image from "next/image"

// Icons
import { AiFillHome } from 'react-icons/ai'
import { BiLibrary } from 'react-icons/bi'
import { BsSearch, BsHeartFill } from 'react-icons/bs'
import { RiAddBoxFill } from 'react-icons/ri'

const Sidebar = () => {
    return (
        <div className="bg-black text-spotify-light-gray w-2/12 h-screen">
            {/* First Section */}
            <div className="ml-4">
                <Link href="/" className="inline-block mt-6">
                    <Image src="/assets/Logo_White.png" width={140} height={140} alt="Sidebar logo white" />
                </Link>
                <Link href="/" className="hover:text-white">
                    <div className="flex mt-6">
                        <AiFillHome size={27} />
                        <p className="ml-3 mt-1 font-bold">Home</p>
                    </div>
                </Link>
                <Link href="/search" className="hover:text-white">
                    <div className="flex my-4">
                        <BsSearch size={27} />
                        <p className="ml-3 font-bold">Search</p>
                    </div>
                </Link>
                <Link href="/collection/playlists" className="hover:text-white">
                    <div className="flex mb-4">
                        <BiLibrary size={27} />
                        <p className="ml-3 font-bold">Your Library</p>
                    </div>
                </Link>
                {/* TODO: Sistemare  */}
                <div className="flex hover:text-white mt-10 mb-4" >
                    <RiAddBoxFill size={27} />
                    <p className="ml-3 font-bold">Create Playlist</p>
                </div>
                <Link href="/collection/tracks" className=" hover:text-white">
                    <div className="flex hover:text-white" >
                        <BsHeartFill size={25} />
                        <p className="ml-3 font-bold">Liked Songs</p>
                    </div>
                </Link>
            </div>
            {/* Second Section */}
            {/* TODO: Implementare la parte delle playlist quando si è loggati. */}
            <div className="ml-4 mt-56">
                <div className="flex">
                    <a href="https://www.spotify.com/it/legal/end-user-agreement/" target="_blank" rel="noopener noreferrer" className="inline-flex focus:outline-none group text-spotify-light-gray">
                        <span className="sidebar-text-link mr-3">Legal</span>
                    </a>
                    <a href="https://www.spotify.com/it/privacy" target="_blank" rel="noopener noreferrer" className="inline-flex focus:outline-none group text-spotify-light-gray">
                        <span className="sidebar-text-link">Privacy Center</span>
                    </a>
                </div>
                <div className="flex my-4">
                    <a href="https://www.spotify.com/it/legal/privacy-policy/" target="_blank" rel="noopener noreferrer" className="inline-flex focus:outline-none group text-spotify-light-gray">
                        <span className="sidebar-text-link mr-3">Privacy Policy</span>
                    </a>
                    {/* TODO: Capire se è possibile gestire i cookie. Se è possibile fare il modal con le preferenze */}
                    <a href="https://" target="_blank" rel="noopener noreferrer" className="inline-flex focus:outline-none group text-spotify-light-gray">
                        <span className="sidebar-text-link">Cookie Settings</span>
                    </a>
                </div>
                <a href="https://www.spotify.com/it/legal/privacy-policy/#s3" className="inline-flex focus:outline-none group text-spotify-light-gray">
                    <span className="sidebar-text-link mr-3">About Ads</span>
                </a>
                <a href="https://www.spotify.com/it/legal/cookies-policy/" target="_blank" rel="noopener noreferrer" className="inline-flex focus:outline-none group">
                    <span className="sidebar-text-link">Cookies</span>
                </a>
            </div>
        </div >
    )
}

export default Sidebar