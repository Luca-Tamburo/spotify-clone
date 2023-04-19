"use client";

// Imports
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react'
import { useSession, signOut } from "next-auth/react"

// Components
import LoadingPage from '@/app/(home)/loading';

// Constants
import * as Constant from '../constants/index'

// Hooks
import useSpotify from '@/hooks/useSpotify';

// Styles
import { IoIosArrowForward, IoIosArrowBack, IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { MdHideImage } from 'react-icons/md';

const Navbar = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const spotifyApi = useSpotify();
    const clickPoint = useRef();
    const [pageInfo, setPageInfo] = useState(undefined);
    const [isOpen, setIsOpen] = useState(false);
    const [isPremium, setIsPremium] = useState(true);
    const [activeLink, setActiveLink] = useState(null);
    const [loading, setLoading] = useState(true);

    const possibleUrls = ['/collection/playlists', '/collection/podcasts', '/collection/artists', '/collection/albums']

    const isSearchPage = pathname.includes("/search");

    const handleFocus = () => { clickPoint.current.style.display = "none"; };

    const handleBlur = () => { clickPoint.current.style.display = "block"; };

    const linkUserPage = "/user/" + `${session.user.username}`;

    const handleGoBack = () => { router.back(); }

    const handleGoForward = () => { router.forward(); }

    const handleClick = (index) => { setActiveLink(index); };

    const [searchTerm, setSearchTerm] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        router.push(`/search/${searchTerm}`);
    }

    useEffect(() => {
        spotifyApi.getMe()
            .then((data) => {
                setPageInfo(data.body);
                if (data.body.product.toLocaleLowerCase() === "free")
                    setIsPremium(false)
                else
                    setIsPremium(true);
            }).catch((err) => {
                console.log('Something went wrong!', err);
            })
            .finally(() => setLoading(false));
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    if (!loading)
        return (
            <nav className='flex justify-between sticky top-0 z-50 bg-current'>
                <div className='flex text-white ml-6 my-4'>
                    {/* TODO: Gestire tutte le casistiche possibili, se è fattibile. */}
                    {/* TODO: Capire se è possibile compattare il codice. */}
                    {window.history.length === 1 ?
                        <>
                            <button onClick={handleGoBack} disabled className='cursor-not-allowed'>
                                <IoIosArrowBack size={35} className='bg-black rounded-full pr-1' />
                            </button>
                            <button onClick={handleGoForward} disabled className='cursor-not-allowed'>
                                <IoIosArrowForward size={35} className='bg-black rounded-full ml-2 pl-1' />
                            </button>
                        </>
                        :
                        <>
                            <button onClick={handleGoBack}>
                                <IoIosArrowBack size={35} className='bg-black rounded-full pr-1' />
                            </button>
                            <button onClick={handleGoForward}>
                                <IoIosArrowForward size={35} className='bg-black rounded-full ml-2 pl-1' />
                            </button>
                        </>
                    }
                </div>
                <div className='flex'>
                    {possibleUrls.includes(pathname) &&
                        Constant.NavbarLinks.map((link) => {
                            return (
                                <Link key={link.id} href={link.url}>
                                    <p className={`${activeLink === link.id ? 'bg-[#333333]' : "bg-black"} text-white text-sm font-bold mt-4 mx-3 mb-2 p-3 rounded-md`} onClick={() => handleClick(link.id)}>
                                        {link.text}
                                    </p>
                                </Link >
                            )
                        })
                    }
                </div>
                <div className='flex'>
                    {isSearchPage &&
                        <form onSubmit={handleSubmit}>
                            <div className="items-center px-4 flex justify-center mt-3" >
                                <div className="relative mr-3">
                                    <div className="absolute top-3 left-3 items-center" ref={clickPoint}>
                                        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
                                    </div>
                                    <input
                                        type="text"
                                        className="block p-2 pl-10 w-70 text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:pl-3"
                                        placeholder="Search Here..."
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <button type="submit">Search</button>
                            </div>
                        </form>
                    }
                </div>
                <div className='flex mr-7 my-2'>
                    {session &&
                        <>
                            {!isPremium && <button className='text-white hover:scale-110 mt-2 mr-2'>
                                <a href='https://www.spotify.com/it/premium/?utm_source=app&utm_medium=desktop&utm_campaign=upgrade&ref=web_loggedin_upgrade_button' target="_blank" rel="noopener noreferrer" className='font-bold mx-2'>
                                    Premium Plans
                                </a>
                            </button>
                            }
                            <div className='relative text-white bg-black hover:bg-spotify-light-dark mt-3 rounded-full'>
                                <button onClick={() => setIsOpen(!isOpen)} className='m-2 inline-flex'>
                                    {pageInfo.images.length === 0 ? <MdHideImage size={25} /> :
                                        <Image
                                            src={pageInfo.images[0].url}
                                            alt="User profile image"
                                            width={25}
                                            height={25}
                                            style={{ borderRadius: '50%' }}
                                        />
                                    }
                                    <span className='ml-2 font-bold'>{pageInfo.display_name}</span>
                                    {isOpen ? <IoIosArrowUp className='mt-1.5 ml-1.5' /> : < IoIosArrowDown className='mt-1.5 ml-1.5' />}
                                </button>
                                {isOpen &&
                                    <div className='absolute bg-spotify-light-dark text-white mt-2 font-semibold rounded' onMouseLeave={() => setIsOpen(false)} onClick={() => setIsOpen(false)}>
                                        <ul className='m-3 pt-1'>
                                            <li className='hover:bg-spotify-gray'>
                                                <Link href={linkUserPage}>Profile</Link>
                                            </li>
                                            {Constant.DropdownLinks.map((link) => (
                                                <li key={link.id} className='my-3 py-1 hover:bg-spotify-gray'>
                                                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                                                        <p className=''>{link.text}</p>
                                                    </a>
                                                </li>
                                            ))}
                                            <hr className='mb-2' />
                                            <li className="hover:bg-spotify-gray">
                                                <button onClick={() => signOut({ callbackUrl: 'http://localhost:3000/' })}>Log out</button>
                                            </li>
                                        </ul>
                                    </div>
                                }
                            </div>
                        </>
                    }
                </div>
            </nav>
        )
    else return <LoadingPage />
}

export default Navbar