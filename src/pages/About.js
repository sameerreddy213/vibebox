import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

function About(props) {

    useEffect(() => {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        document.title = "About - VibeBox"
    }, [])

    return (
        <div className="bg-black min-h-screen text-white pb-32 relative overflow-hidden">
            {/* Background Blob Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-[#1db954]/20 blur-[120px] rounded-full pointer-events-none"></div>

            <section className="body-font relative z-10">
                <div className="container px-5 pt-12 pb-10 mx-auto">

                    {/* Header */}
                    <div className="flex flex-col text-center w-full mb-16">
                        <Link to="/">
                            <h1 className="sm:text-5xl text-4xl font-extrabold title-font mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#1db954] to-[#1ed760] hover:scale-105 transition-transform cursor-pointer inline-block">
                                VibeBox
                            </h1>
                        </Link>
                        <p className="lg:w-2/3 mx-auto leading-relaxed text-lg text-gray-300">
                            Your ultimate ad-free music companion, powered by the unofficial JioSaavn API.
                        </p>
                    </div>

                    {/* Info Grid (Dev & Company) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-5xl mx-auto">
                        {/* Developer Info */}
                        <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#1db954]/50 transition-all duration-300 shadow-2xl group hover:-translate-y-1">
                            <h2 className="text-xs text-[#1db954] tracking-[0.2em] font-bold uppercase mb-4">Developed By</h2>
                            <h1 className="text-2xl font-bold text-white mb-6">Tamalampudi Sameer Reddy</h1>
                            <a
                                href="https://www.linkedin.com/in/sameerreddy213/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center bg-[#0077b5] text-white py-2.5 px-6 rounded-full text-base font-semibold hover:bg-[#006399] transition-all shadow-lg hover:shadow-[#0077b5]/30"
                            >
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                Connect on LinkedIn
                            </a>
                        </div>

                        {/* Company Info */}
                        <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#1db954]/50 transition-all duration-300 shadow-2xl group hover:-translate-y-1">
                            <h2 className="text-xs text-[#1db954] tracking-[0.2em] font-bold uppercase mb-4">Company Name</h2>
                            <h1 className="text-2xl font-bold text-white mb-6">SR NOVA TECH PRIVATE LIMITED</h1>
                            <a
                                href="https://sr-nova-tech.vercel.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center bg-gradient-to-r from-[#1db954] to-[#19e68c] text-black py-2.5 px-6 rounded-full text-base font-bold hover:opacity-90 transition-all shadow-lg hover:shadow-[#1db954]/30"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                                Visit Website
                            </a>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="flex flex-col text-center mb-12">
                        <h2 className="text-sm text-gray-500 tracking-[0.2em] font-medium title-font mb-1 uppercase">Why VibeBox?</h2>
                        <h1 className="sm:text-3xl text-2xl font-bold title-font text-white">The Ultimate Experience</h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left max-w-6xl mx-auto">
                        {[
                            { title: "Completely Ad-Free", desc: "Experience music without interruptions. No banner ads, no audio ads, just pure vibes." },
                            { title: "Mobile First Design", desc: "Enhanced UI with a seamless bottom navigation bar and touch-friendly carousels for the perfect mobile experience." },
                            { title: "Full Screen Player", desc: "Immersive 'Now Playing' mode with large album art, scrubber, and accessible controls." },
                            { title: "High Quality Audio", desc: "Stream your favorite tracks in the highest quality (320kbps) for a premium listening experience." },
                            { title: "Easy Downloads", desc: "Download songs directly to your device for offline playback with a single tap." },
                            { title: "Unofficial API", desc: "Powered by Sumit Kolhe's Unofficial JioSaavn API to fetch the latest trending music." }
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white/5 p-6 rounded-xl border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                                <h2 className="text-lg text-white font-bold mb-3">{feature.title}</h2>
                                <p className="leading-relaxed text-gray-400 text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </div>


                    {/* Tech Stack */}
                    <div className="flex flex-col text-center mt-20 mb-6">
                        <h2 className="text-xs text-gray-500 tracking-[0.2em] font-medium title-font mb-2 uppercase">Powered By</h2>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a href="https://react.dev/" target="_blank" rel="noopener noreferrer" className="bg-[#121212] hover:bg-[#181818] border border-white/10 px-5 py-2 rounded-full text-sm font-medium text-blue-400 transition-colors">ReactJS</a>
                        <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" className="bg-[#121212] hover:bg-[#181818] border border-white/10 px-5 py-2 rounded-full text-sm font-medium text-cyan-400 transition-colors">TailwindCSS</a>
                        <a href="https://github.com/sumitkolhe/jiosaavn-api" target="_blank" rel="noopener noreferrer" className="bg-[#121212] hover:bg-[#181818] border border-white/10 px-5 py-2 rounded-full text-sm font-medium text-green-500 transition-colors">JioSaavn API</a>
                    </div>

                </div>
            </section>
        </div>
    )
}

export default About
