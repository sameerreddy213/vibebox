import React from 'react'
import { useNavigate } from 'react-router-dom'
import Card from './Card'

function Playlists(props) { //playlists ,setPlaylistId
    const navigate = useNavigate(); //for navigating to /playlists


    const isCarousel = props.layout === 'carousel';

    return (
        <div className={
            isCarousel
                ? "flex overflow-x-auto gap-4 snap-x px-4 scrollbar-hide md:grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 md:gap-4 md:overflow-visible"
                : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
        }>
            {props.playlists.map((playlist) => {
                let imageUrl = '';
                if (playlist.image) {
                    if (Array.isArray(playlist.image)) {
                        if (playlist.image.length > 2) imageUrl = playlist.image[2].url;
                        else if (playlist.image.length > 0) imageUrl = playlist.image[playlist.image.length - 1].url;
                    } else {
                        imageUrl = playlist.image
                    }
                }
                return (
                    <div key={playlist.id} className={isCarousel ? "min-w-[140px] w-[140px] md:w-auto snap-start flex-shrink-0" : ""}>
                        <Card onClick={() => {
                            if (props.onPlaylistClick) {
                                props.onPlaylistClick(playlist);
                            } else {
                                props.setPlaylistId(playlist.id);
                                navigate("/playlists");
                            }
                        }} image={imageUrl} name={playlist.name.replace(/&quot;/g, '"')} />
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
export default Playlists
