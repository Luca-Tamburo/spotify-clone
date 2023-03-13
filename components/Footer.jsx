// Imports
import React from 'react'

// Constants
import FooterInfo from '../constants/Footer';

// Styles
import { GrInstagram, GrTwitter } from 'react-icons/gr';
import { BsFacebook } from 'react-icons/bs';

const Footer = () => {
    return (
        <footer className='flex bg-spotify-dark pt-20 pb-6 pl-10'>
            <div className='w-2/12'>
                <p className='font-bold text-white mb-2'>Company</p>
                {FooterInfo[0].map((item, index) => {
                    return (
                        <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="flex footer-text-link mt-1">{item.text}</a>
                    )
                })}
            </div>
            <div className='w-2/12'>
                <p className='font-bold text-white mb-2'>Communities</p>
                {FooterInfo[1].map((item, index) => {
                    return (
                        <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="flex footer-text-link mt-1">{item.text}</a>
                    )
                })}
            </div>
            <div className='w-2/12'>
                <p className='font-bold text-white mb-2'>Useful links</p>
                {FooterInfo[2].map((item, index) => {
                    return (
                        <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="flex footer-text-link mt-1">{item.text}</a>
                    )
                })}
            </div>
            <div className='w-2/12 mt-7'>
                <div className='flex flex-col'>
                    {FooterInfo[3].map((item, index) => {
                        return (
                            <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="flex footer-text-link mt-1">{item.text}</a>
                        )
                    })}
                </div>
            </div>
            {/* TODO: Capire se è possibile gestire i cookie. Se è possibile fare il modal con le preferenze */}
            <div className='w-2/12 mt-7'>
                <div className='flex flex-col'>
                    {FooterInfo[4].map((item, index) => {
                        return (
                            <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="flex footer-text-link mt-1">{item.text}</a>
                        )
                    })}
                </div>
            </div>
            <div className='flex flex-row-reverse w-4/12 mr-6 mt-10'>
                <a href='https://www.facebook.com/Spotify' target="_blank" rel="noopener noreferrer">
                    <BsFacebook size={30} className="text-white" />
                </a>
                <a href='https://twitter.com/spotify' target="_blank" rel="noopener noreferrer">
                    <GrTwitter size={30} className="text-white mx-5" />
                </a>
                <a href="https://www.instagram.com/spotify/" target="_blank" rel="noopener noreferrer">
                    <GrInstagram size={26} className="text-white" />
                </a>
            </div>
        </footer>
    )
}

export default Footer