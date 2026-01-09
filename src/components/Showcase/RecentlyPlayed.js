import React, { useEffect, useState } from 'react'
import Items from '../common/Items'
import Heading from './Heading'

function RecentlyPlayed(props) {
    const [history, setHistory] = useState([])

    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem('recentlyPlayed') || '[]')
        setHistory(storedHistory)
    }, [props.triggerUpdate]) // Trigger update when something plays? Or just once on mount. 
    // Actually Showcase mounts once, so this might need a way to refresh. 
    // For now, let's load on mount. If user plays a song, it adds to history, but the list on home page 
    // won't update until refresh. That is acceptable for V1.

    if (history.length === 0) return null

    return (
        <div className="mb-8">
            <Heading title="Recently Played" />
            <div className="w-full flex gap-4 overflow-x-auto scrollbar-hide py-4 px-4 md:px-0">
                {history.map((song) => (
                    <div key={song.id} className="min-w-[140px] w-[140px] md:min-w-[180px] md:w-[180px] flex-shrink-0">
                        <Items
                            song={song}
                            variant="card"
                            onClick={() => props.onPlay(song)} // Play the song
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RecentlyPlayed
