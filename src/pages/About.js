import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

function About(props) {

    useEffect(() => {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        document.title = "About - VibeBox"
    }, [])

    return (
        <div className="bg-black min-h-screen text-white pb-32">
            <section className="body-font">
                <div className="container px-5 pt-10 pb-10 mx-auto">

                    {/* Header */}
                    <div className="flex flex-col text-center w-full mb-12">
                        <Link to="/">
                            <h1 className="sm:text-4xl text-3xl font-bold title-font mb-4 text-white hover:text-[#1db954] transition-colors">VibeBox</h1>
                        </Link>
                        <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-gray-400">
                            Your ultimate ad-free music companion, powered by the unofficial JioSaavn API.
                        </p>
                    </div>

                    {/* Developer Info */}
                    <div className="flex flex-col items-center justify-center mb-16 bg-[#181818] p-8 rounded-xl border border-[#282828] max-w-2xl mx-auto shadow-lg hover:border-[#1db954] transition-colors group">
                        <h2 className="text-sm text-[#1db954] tracking-widest font-bold uppercase mb-2">Developed By</h2>
                        <h1 className="text-2xl font-bold text-white mb-4">Tamalampudi Sameer Reddy</h1>
                        <a
                            href="https://www.linkedin.com/in/sameerreddy213/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center bg-[#0077b5] text-white border-0 py-2 px-6 focus:outline-none hover:bg-[#006399] rounded text-lg font-semibold transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                            Connect on LinkedIn
                        </a>
                    </div>

                    {/* Company Info */}
                    <div className="flex flex-col items-center justify-center mb-16 bg-[#181818] p-8 rounded-xl border border-[#282828] max-w-2xl mx-auto shadow-lg hover:border-[#1db954] transition-colors group">
                        <h2 className="text-sm text-[#1db954] tracking-widest font-bold uppercase mb-2">Company Name</h2>
                        <h1 className="text-2xl font-bold text-center text-white mb-4">SR NOVA TECH PRIVATE LIMITED</h1>
                        <a
                            href="https://sr-nova-tech.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center bg-[#1db954] text-white border-0 py-2 px-6 focus:outline-none hover:bg-[#1ed760] rounded text-lg font-semibold transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                            Visit Website
                        </a>
                    </div>

                    {/* Features Grid */}
                    <div className="flex flex-col text-center mb-8">
                        <h2 className="text-sm text-gray-500 tracking-widest font-medium title-font mb-1 uppercase">Key Features</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                        {/* Feature 1 */}
                        <div className="bg-[#121212] p-6 rounded-lg border border-[#282828] hover:bg-[#181818] transition-colors">
                            <h2 className="text-lg text-white font-bold mb-2">Completely Ad-Free</h2>
                            <p className="leading-relaxed text-gray-400 text-sm">Experience music without interruptions. No banner ads, no audio ads, just pure vibes.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-[#121212] p-6 rounded-lg border border-[#282828] hover:bg-[#181818] transition-colors">
                            <h2 className="text-lg text-white font-bold mb-2">Mobile First Design</h2>
                            <p className="leading-relaxed text-gray-400 text-sm">Enhanced UI with a seamless bottom navigation bar and touch-friendly carousels for the perfect mobile experience.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-[#121212] p-6 rounded-lg border border-[#282828] hover:bg-[#181818] transition-colors">
                            <h2 className="text-lg text-white font-bold mb-2">Full Screen Player</h2>
                            <p className="leading-relaxed text-gray-400 text-sm">Immersive "Now Playing" mode with large album art, scrubber, and accessible controls.</p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-[#121212] p-6 rounded-lg border border-[#282828] hover:bg-[#181818] transition-colors">
                            <h2 className="text-lg text-white font-bold mb-2">High Quality Audio</h2>
                            <p className="leading-relaxed text-gray-400 text-sm">Stream your favorite tracks in the highest quality (320kbps) for a premium listening experience.</p>
                        </div>

                        {/* Feature 5 */}
                        <div className="bg-[#121212] p-6 rounded-lg border border-[#282828] hover:bg-[#181818] transition-colors">
                            <h2 className="text-lg text-white font-bold mb-2">Easy Downloads</h2>
                            <p className="leading-relaxed text-gray-400 text-sm">Download songs directly to your device for offline playback with a single tap.</p>
                        </div>

                        {/* Feature 6 */}
                        <div className="bg-[#121212] p-6 rounded-lg border border-[#282828] hover:bg-[#181818] transition-colors">
                            <h2 className="text-lg text-white font-bold mb-2">Unofficial API</h2>
                            <p className="leading-relaxed text-gray-400 text-sm">Powered by Sumit Kolhe's Unofficial JioSaavn API to fetch the latest trending music.</p>
                        </div>
                    </div>


                    {/* Tech Stack */}
                    <div className="flex flex-col text-center mt-16 mb-4">
                        <h2 className="text-sm text-gray-500 tracking-widest font-medium title-font mb-1 uppercase">Built With</h2>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a href="https://react.dev/" target="_blank" rel="noopener noreferrer" className="bg-[#202020] hover:bg-[#282828] border border-[#333] px-4 py-2 rounded-full text-sm font-medium text-blue-400">ReactJS</a>
                        <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" className="bg-[#202020] hover:bg-[#282828] border border-[#333] px-4 py-2 rounded-full text-sm font-medium text-cyan-400">TailwindCSS</a>
                        <a href="https://github.com/sumitkolhe/jiosaavn-api" target="_blank" rel="noopener noreferrer" className="bg-[#202020] hover:bg-[#282828] border border-[#333] px-4 py-2 rounded-full text-sm font-medium text-green-500">JioSaavn API</a>
                    </div>

                </div>
            </section>
        </div>
    )
}

export default About
