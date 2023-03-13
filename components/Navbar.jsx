"use client";

// Imports
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useSession, signOut } from "next-auth/react"

// Components
import LoadingPage from '@/app/(home)/loading';

// Constants
import DropdownLinks from '@/constants/DropdownMenu';

// Hooks
import useSpotify from '@/hooks/useSpotify';

// Styles
import { IoIosArrowForward, IoIosArrowBack, IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'

const Navbar = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const spotifyApi = useSpotify();
    const [isOpen, setIsOpen] = useState(false);
    const [isPremium, setIsPremium] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        spotifyApi.getMe()
            .then((data) => {
                if (data.body.product.toLocaleLowerCase() === "free")
                    setIsPremium(false)
                else
                    setIsPremium(true);
            }).catch((err) => {
                console.log('Something went wrong!', err);
            })
            .finally(() => setLoading(false));
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const linkUserPage = "/user/" + `${session.user.username}`;

    const handleGoBack = () => {
        router.back();
    }

    const handleGoForward = () => {
        router.forward();
    }


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
                <div className='flex mr-7 my-2'>
                    {session &&
                        <>
                            {!isPremium && <button className='text-white hover:scale-110 mt-3 mr-3'>
                                <a href='https://www.spotify.com/it/premium/?utm_source=app&utm_medium=desktop&utm_campaign=upgrade&ref=web_loggedin_upgrade_button' target="_blank" rel="noopener noreferrer" className='font-bold mx-2'>
                                    Premium Plans
                                </a>
                            </button>
                            }
                            <div className='relative text-white bg-black hover:bg-spotify-light-dark mt-3 rounded-full'>
                                <button onClick={() => setIsOpen(!isOpen)} className='m-2 inline-flex'>
                                    <Image
                                        src={session.user.image}
                                        alt="User profile image"
                                        width={25}
                                        height={25}
                                        style={{ borderRadius: '50%' }}
                                    />
                                    <span className='ml-2 font-bold'>{session.user.name}</span>
                                    {isOpen ? <IoIosArrowUp className='mt-1.5 ml-1.5' /> : < IoIosArrowDown className='mt-1.5 ml-1.5' />}
                                </button>
                                {isOpen &&
                                    <div className='absolute bg-spotify-light-dark text-white mt-2 font-semibold rounded '>
                                        <ul className='m-3 pt-1'>
                                            <li className='hover:bg-spotify-gray'>
                                                <Link href={linkUserPage}>Profile</Link>
                                            </li>
                                            {DropdownLinks.map((link) => (
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