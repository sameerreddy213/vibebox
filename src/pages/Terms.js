import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

function Terms(props) {

    useEffect(() => {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        document.title = "Terms of Use - VibeBox"
    }, [])

    return (
        <div className="bg-black min-h-screen text-white pb-32">
            <div className="container px-5 pt-10 pb-10 mx-auto">
                <div className="flex flex-col text-center w-full mb-12">
                    <h1 className='sm:text-3xl text-2xl font-bold title-font mb-4 text-white'>Terms of Use & Disclaimer</h1>
                    <p className='lg:w-2/3 mx-auto leading-relaxed text-base text-gray-400'>
                        <Link to="/" className="text-[#1db954] hover:underline hover:text-white font-semibold">VibeBox</Link> is a personal learning project. Please review our terms below.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto bg-[#121212] p-8 rounded-xl border border-[#282828]">
                    <ul className='space-y-6 text-gray-300'>
                        <li>
                            <span className='block font-bold text-white text-lg mb-1'>Personal Project</span>
                            VibeBox is created solely for educational purposes to demonstrate ReactJS capabilities. It is non-commercial and not intended for monetization.
                        </li>

                        <li>
                            <span className='block font-bold text-white text-lg mb-1'>Unofficial API Usage</span>
                            This application utilizes <a href="https://github.com/sumitkolhe/jiosaavn-api" target="_blank" rel="noopener noreferrer" className='text-[#1db954] hover:underline'>Sumit Kolhe's Unofficial JioSaavn API</a> to fetch metadata and audio links. We do not host any copyrighted content.
                        </li>

                        <li>
                            <span className='block font-bold text-white text-lg mb-1'>Copyright & Ownership</span>
                            All content (songs, images, metadata) belongs to <b>JioSaavn</b> and their respective owners/labels. We do not claim ownership of any media displayed.
                        </li>

                        <li>
                            <span className='block font-bold text-white text-lg mb-1'>Usage Policy</span>
                            Users agree to use this platform for personal entertainment only. Distribution of downloaded content or engaging in piracy is strictly prohibited.
                        </li>
                    </ul>

                    <div className="mt-8 pt-8 border-t border-[#282828] text-center text-sm text-gray-500">
                        By using VibeBox, you acknowledge and agree to these terms.
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Terms
