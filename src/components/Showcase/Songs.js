import React from 'react'
import Card from './Card'


function Songs(props) {

    const isCarousel = props.layout === 'carousel';

    return (
        <div className={
            isCarousel
                ? "flex overflow-x-auto gap-4 snap-x px-4 scrollbar-hide md:grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 md:gap-4 md:overflow-visible"
                : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
        }>
            {props.songs.map((song) => {
                return (
                    <div key={song.id} className={isCarousel ? "min-w-[140px] w-[140px] md:w-auto snap-start flex-shrink-0" : ""}>
                        <Card
                            onClick={() => props.searchFromId(song.id)}
                            image={song.image}
                            name={song.name ? song.name.replace(/&quot;/g, '"') : ''}
                        />
                    </div>
                )
            })}

            {/* Show More Card */}
            {isCarousel && props.hasMore && (
                <div className="min-w-[140px] w-[140px] md:w-auto snap-start flex-shrink-0 md:hidden flex flex-col items-center justify-center p-4 bg-[#181818] border border-[#282828] rounded-md cursor-pointer hover:bg-[#282828] aspect-[3/4]" onClick={props.onLoadMore}>
                    <div className="w-12 h-12 rounded-full border-2 border-gray-400 flex items-center justify-center mb-2">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                    <span className="text-gray-400 text-sm font-semibold">Show More</span>
                </div>
            )}
        </div>
    )
}

export default Songs
