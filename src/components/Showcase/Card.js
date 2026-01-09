import React from 'react'

function Card(props) {
    return (
        <div
            onClick={props.onClick}
            className="bg-[#181818] p-4 rounded-md hover:bg-[#282828] transition-all duration-300 cursor-pointer group flex flex-col w-full"
        >
            <div className="relative mb-4 w-full aspect-square shadow-xl">
                <img
                    className="w-full h-full object-cover rounded-md"
                    src={props.image}
                    alt={props.name}
                    loading="lazy"
                />

                {/* Spotify Play Button on Hover */}
                <div className="absolute bottom-2 right-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-xl z-10">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (props.onClick) props.onClick();
                        }}
                        className="w-12 h-12 bg-[#1db954] rounded-full flex items-center justify-center hover:scale-105 shadow-md">
                        <svg className="w-6 h-6 text-black pl-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                    </button>
                </div>
            </div>

            <div className="flex-1 min-h-[50px] flex flex-col justify-start">
                <h2 className="text-white font-bold truncate text-base mb-1" title={props.name}>
                    {props.name}
                </h2>
                {/* Description/Subtitle would go here if available */}
                <p className="text-[#a7a7a7] text-sm line-clamp-2 leading-tight">
                    {/* Placeholder for subtitle if we had one, or just artist */}
                </p>
            </div>
        </div>
    )
}

export default Card
