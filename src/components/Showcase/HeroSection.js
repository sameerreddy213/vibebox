import React from 'react';

function HeroSection(props) {
    if (!props.item) return null;

    const imageUrl = (props.item.image && props.item.image.length > 0 && props.item.image[props.item.image.length - 1]?.url)
        ? props.item.image[props.item.image.length - 1].url
        : 'https://www.scdn.co/i/_global/twitter_card-default.jpg';

    // Fallback image if needed, or higher res if available in different logic
    // Usually API gives 500x500 which is decent for mobile hero, might be blurry for desktop full width
    // But we work with what we have.

    return (
        <div className="hidden md:block relative w-full h-[400px] md:h-[500px] mb-8 group rounded-b-2xl md:rounded-2xl overflow-hidden shadow-2xl transition-all duration-500">
            {/* Background Image with Gradient Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${imageUrl})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full flex flex-col items-start justify-end h-full">
                <span className="text-[#1db954] text-xs md:text-sm font-bold tracking-widest uppercase mb-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded">
                    Trending Hit
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-2 leading-tight drop-shadow-lg line-clamp-2">
                    {props.item.name.replace(/&quot;/g, '"')}
                </h1>
                <p className="text-gray-300 text-lg md:text-xl mb-6 font-medium drop-shadow-sm">
                    By {props.item.artists?.primary?.map(a => a.name).join(', ') || props.item.primaryArtists || 'Unknown Artist'}
                </p>

                <div className="flex gap-4">
                    <button
                        onClick={() => props.onPlay(props.item)}
                        className="bg-[#1db954] hover:bg-[#1ed760] text-black font-bold py-3 px-8 rounded-full flex items-center transition-transform hover:scale-105 shadow-lg active:scale-95"
                    >
                        <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                        Play Now
                    </button>
                    {/* Add to favorites or other actions could go here */}
                </div>
            </div>
        </div>
    );
}

export default HeroSection;
