// Imports
import React from 'react'

// Styles
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io'

const Navbar = () => {
    return (
        <nav className='flex justify-between bg-spotify-dark'>
            {/* TODO: Collegare le action avanti e indietro */}
            <div className='flex text-white ml-6 my-4'>
                <button>
                    <IoIosArrowBack size={35} className='bg-black rounded-full pr-1' />
                </button>
                <button>
                    <IoIosArrowForward size={35} className='bg-black rounded-full ml-2 pl-1' />
                </button>
            </div>
            <div className='flex mr-7 my-2'>
                <button>
                    <p className="mr-8 font-bold text-spotify-light-gray hover:text-white hover:scale-110">Sign up</p>
                </button>
                <button className='bg-white rounded-full hover:scale-110'>
                    <p className='font-bold text-black mx-8 my-2'>Log in</p>
                </button>
            </div>
        </nav>
    )
}

export default Navbar