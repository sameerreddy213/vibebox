import React from 'react'

const Items = ({ song, onClick, variant = 'card', isActive = false }) => {

    // Fallback image logic
    const getImage = (images) => {
        if (!images) return '';
        if (Array.isArray(images)) {
            if (images.length > 2) return images[2].url;
            if (images.length > 0) return images[images.length - 1].url;
        }
        return '';
    }

    const imageUrl = getImage(song.image);
    const title = song.name ? song.name.replace(/&quot;/g, '"') : (song.title ? song.title.replace(/&quot;/g, '"') : 'Unknown');
    const subtitle = song.artist || (song.primaryArtists ? song.primaryArtists : (song.artists?.primary?.map(a => a.name).join(', ') || ''));

    // --- CARD VIEW (Albums, Playlists, Grid) ---
    // Used in Showcase lists
    if (variant === 'card' || (!song.type || song.type !== 'song')) {
        return (
            <div onClick={onClick} className="p-4 bg-[#181818] hover:bg-[#282828] rounded-md cursor-pointer transition-all duration-300 group w-full">
                <div className="relative mb-4 w-full aspect-square shadow-lg">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover rounded-md"
                    />
                    {/* Play Button Overlay (Spotify Style) */}
                    <div className="absolute bottom-2 right-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-xl">
                        <button className="w-12 h-12 bg-[#1db954] rounded-full flex items-center justify-center hover:scale-105">
                            <svg className="w-6 h-6 text-black pl-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                        </button>
                    </div>
                </div>
                <div>
                    <h3 className="text-white font-bold truncate mb-1">{title}</h3>
                    <p className="text-gray-400 text-sm truncate">{subtitle}</p>
                </div>
            </div>
        )
    }

    // --- ROW VIEW (Search Results, Song Lists) ---
    return (
        <div onClick={onClick} className="flex items-center p-2 rounded-md hover:bg-[#282828] cursor-pointer group transition-colors">

            {/* Play/Index Icon */}
            <div className="w-8 flex justify-center text-gray-400 mr-4">
                <span className="group-hover:hidden">{song.position || '#'}</span>
                <button className="hidden group-hover:block text-white">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                </button>
            </div>

            {/* Image */}
            <img src={imageUrl} alt={title} className="w-10 h-10 rounded mr-4" />

            {/* Title & Artist */}
            <div className="flex-1 min-w-0 mr-4">
                <div className={`font-normal truncate group-hover:underline ${isActive ? 'text-[#1db954]' : 'text-white'}`}>{title}</div>
                <div className="text-sm text-gray-400 truncate group-hover:text-white">{subtitle}</div>
            </div>

            {/* Album (Hidden on small screens) */}
            <div className="hidden md:block w-1/3 text-sm text-gray-400 truncate mr-4">
                {song.album && typeof song.album === 'object' ? (song.album.name || '') : (song.album || '')}
            </div>

            {/* Duration / Action */}
            <div className="text-sm text-gray-400 font-mono">
                {/* Placeholder duration if not available */}
                {song.duration ? Math.floor(song.duration / 60) + ':' + (song.duration % 60 < 10 ? '0' : '') + (song.duration % 60) : '...'}
            </div>

            {/* Download Button (Requirement) */}
            <button className="ml-4 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" title="Download">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
            </button>
        </div>
    )
}

export default Items
