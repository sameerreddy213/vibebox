import React, { useEffect, useState, useRef } from 'react'
import Marquee from '../common/Marquee';

function Player(props) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isShuffle, setIsShuffle] = useState(false);
    const [repeatMode, setRepeatMode] = useState(0); // 0: Off, 1: All, 2: One
    const [isFullScreen, setIsFullScreen] = useState(false);
    const audioRef = useRef(null);

    // Download Logic (Preserved)
    const downloadBlob = (blob, filename) => {
        var a = document.createElement('a');
        a.download = filename;
        a.href = blob;
        document.body.appendChild(a);
        props.setProgress(90)
        a.click();
        a.remove();
        props.setProgress(100)
    }

    const downloadSong = async () => {
        // Confirmation removed as per user request

        props.showAlert(`Downloading ${props.details.name.replace(/&quot;/g, '"')}...`)
        props.setProgress(10)

        const downloadUrlArray = props.details.downloadUrl || []
        const url = downloadUrlArray.length > 0 ? downloadUrlArray[downloadUrlArray.length - 1].url : ''

        if (!url) {
            alert('Download URL not available')
            return
        }

        const primaryArtists = props.details.artists?.primary?.map(a => a.name).join(', ') || props.details.primaryArtists || 'Unknown Artist'
        const filename = props.details.name.replace(/&quot;/g, '"') + ` - ${primaryArtists.split(',')[0]}.m4a`

        const response = await fetch(url)
        props.setProgress(50)
        const blob = await response.blob()
        props.setProgress(70)
        let blobUrl = window.URL.createObjectURL(blob);
        downloadBlob(blobUrl, filename);
    }

    const fetchAndPlayRelated = async () => {
        try {
            const currentSong = props.details;
            let query = "";

            // Strategy 1: Album/Movie (Highest Priority - User Request)
            if (currentSong.album?.name) {
                query = `${currentSong.album.name} Songs`;
            }
            // Strategy 2: Artist
            else if (currentSong.artists?.primary?.length > 0) {
                query = `${currentSong.artists.primary[0].name} Songs`;
            } else if (currentSong.primaryArtists) {
                query = `${currentSong.primaryArtists.split(',')[0]} Songs`;
            }
            // Strategy 3: Language
            else if (currentSong.language) {
                query = `${currentSong.language} Songs`;
            } else {
                query = "Trending Songs";
            }

            props.showAlert(`Autoplaying related to: ${query}...`);
            props.setProgress(30);

            // Step 1: Search
            const searchUri = `/api/search?query=${encodeURIComponent(query)}`;
            const response = await fetch(searchUri);
            const resp = await response.json();

            if (!resp.success || !resp.data) {
                props.showAlert("No related songs found.");
                props.setProgress(100);
                return;
            }

            let searchResults = [];
            if (resp.data.songs?.results) {
                searchResults = resp.data.songs.results;
            } else if (resp.data.results) {
                searchResults = resp.data.results;
            }

            if (searchResults.length === 0) {
                props.showAlert("No songs found.");
                props.setProgress(100);
                return;
            }

            // Step 2: Fetch Full Details (Critical for downloadUrl)
            // Take top 5 results to keep it snappy
            const topSongIds = searchResults.slice(0, 5).map(s => s.id).join(',');

            const detailsUri = `/api/songs?ids=${topSongIds}`;
            const detailsResponse = await fetch(detailsUri);
            const detailsResp = await detailsResponse.json();

            let newSongs = [];
            if (detailsResp.success && detailsResp.data) {
                newSongs = detailsResp.data; // Array of full song objects
            }

            if (newSongs.length > 0) {
                // Append to queue
                // Filter out duplicates from current queue to avoid mess
                const existingIds = new Set(props.queue.map(s => s.id));
                const uniqueNewSongs = newSongs.filter(s => !existingIds.has(s.id));

                if (uniqueNewSongs.length === 0) {
                    props.showAlert("No new related songs found.");
                    props.setProgress(100);
                    return;
                }

                const updatedQueue = [...props.queue, ...uniqueNewSongs];
                props.setQueue(updatedQueue);

                // Play first new song
                // We appended, so the next song is at the old length index
                const nextSongIndex = props.queue.length;
                if (updatedQueue[nextSongIndex]) {
                    props.setDetails(updatedQueue[nextSongIndex]);
                }
            } else {
                props.showAlert("Unable to fetch song details.");
            }
            props.setProgress(100);

        } catch (error) {
            console.error("Auto-play error:", error);
            props.setProgress(100);
        }
    }

    useEffect(() => {
        if (!props.details) return;

        // Save to Recently Played
        const addToHistory = (song) => {
            let history = JSON.parse(localStorage.getItem('recentlyPlayed') || '[]');
            // Remove if exists (to move to top)
            history = history.filter(item => item.id !== song.id);
            // Add to front
            history.unshift(song);
            // Limit to 20
            if (history.length > 20) history.pop();
            localStorage.setItem('recentlyPlayed', JSON.stringify(history));
        }
        addToHistory(props.details);


        document.title = `Playing ${props.details.name.replace(/&quot;/g, '"')} - VibeBox`
        const audio = audioRef.current;

        const downloadUrl = props.details.downloadUrl && props.details.downloadUrl.length > 0 ? (props.details.downloadUrl[props.details.downloadUrl.length - 1].url || '') : '';

        if (!downloadUrl) {
            console.warn("No download URL found for song:", props.details.name);
            setIsPlaying(false);
            return;
        }

        // Auto play when details change
        audio.pause();
        audio.load();

        const setAudioData = () => {
            setDuration(audio.duration);
            setIsPlaying(true)
            var playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Autoplay prevented or failed:", error);
                    setIsPlaying(false);
                });
            }
        };

        const updateTime = () => setCurrentTime(audio.currentTime);
        const onEnd = () => {
            // Handle Repeat One
            if (repeatMode === 2) {
                audio.currentTime = 0;
                audio.play();
                return;
            }

            // Auto-play next song
            handleNext(true); // true = auto (can trigger Repeat All loop)
        };

        audio.addEventListener('loadeddata', setAudioData);
        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('ended', onEnd);

        return () => {
            audio.removeEventListener('loadeddata', setAudioData);
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('ended', onEnd);
        }
    }, [props.details]);

    const handlePlayPause = () => {
        const audio = audioRef.current;
        if (!audio || !audio.src) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play().catch(e => console.error("Play failed", e));
            setIsPlaying(true);
        }
    }

    const handleSeek = (e) => {
        const audio = audioRef.current;
        const seekTime = (duration / 100) * e.target.value;
        audio.currentTime = seekTime;
        setCurrentTime(seekTime);
    }

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        audioRef.current.volume = newVolume;
    }

    const handleNext = (auto = false) => {
        if (!props.queue || props.queue.length === 0) return;

        // If Shuffle is on
        if (isShuffle) {
            const randomIndex = Math.floor(Math.random() * props.queue.length);
            props.setDetails(props.queue[randomIndex]);
            return;
        }

        const currentIndex = props.queue.findIndex(s => s.id === props.details.id);

        // Loop logic for "All" or just "Next"
        if (currentIndex < props.queue.length - 1) {
            props.setDetails(props.queue[currentIndex + 1]);
        } else if (repeatMode === 1 && auto) {
            // Loop back to start if Repeat All is active and it's an auto-transition
            props.setDetails(props.queue[0]);
        } else if (!auto) {
            // Manual click on last song -> Check if we want to fetch more or loop
            // User Request: "when clicked on next also it should also go" (fetch related)
            fetchAndPlayRelated();
        } else {
            // Auto-end of queue
            fetchAndPlayRelated();
        }
    }

    const handlePrev = () => {
        // User Request: "if previous song button is clicked it should play last listened song"
        // Removed the "restart if > 3s" check to force navigation.

        if (!props.queue || props.queue.length === 0) return;

        const currentIndex = props.queue.findIndex(s => s.id === props.details.id);

        if (currentIndex > 0) {
            // Normal queue navigation
            props.setDetails(props.queue[currentIndex - 1]);
        } else {
            // Start of queue - Try Global History
            try {
                const history = JSON.parse(localStorage.getItem('recentlyPlayed') || '[]');
                // history[0] is current song (added in useEffect)
                // history[1] is the previous song
                if (history.length > 1) {
                    const prevSong = history[1];
                    props.setDetails(prevSong);
                    // We don't necessarily update queue here, 
                    // so clicking 'Next' will likely jump back to the start of the current queue 
                    // or fetch related if not found, which is acceptable flow.
                } else {
                    // No history, restart current
                    audioRef.current.currentTime = 0;
                }
            } catch (e) {
                console.error("History navigation failed", e);
                audioRef.current.currentTime = 0;
            }
        }
    }

    // Formatting helpers
    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }



    // Hide player if no song is selected
    if (!props.details) return null;

    return (
        <>
            {/* Full Screen Player Overlay (Mobile) */}
            <div className={`fixed inset-0 z-[60] bg-gradient-to-b from-[#2b2b2b] to-black flex flex-col p-6 transition-transform duration-300 md:hidden ${isFullScreen ? 'translate-y-0' : 'translate-y-full'}`}>

                {/* Header */}
                <div className="flex items-center justify-between mb-4 md:mb-8">
                    <button onClick={() => setIsFullScreen(false)} className="text-white p-2">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Now Playing</span>
                    <div className="w-8"></div> {/* Spacer for alignment */}
                </div>

                {/* Artwork */}
                <div className="flex-1 flex items-center justify-center mb-6 overflow-hidden">
                    <img
                        src={props.details.image && props.details.image.length > 0 ? (props.details.image[props.details.image.length - 1].url || '') : ''}
                        alt="cover"
                        className="w-auto h-[40vh] max-h-[300px] md:max-h-full aspect-square object-cover rounded-lg shadow-2xl"
                        onError={(e) => { e.target.src = 'https://www.scdn.co/i/_global/twitter_card-default.jpg' }}
                    />
                </div>

                {/* Info */}
                <div className="mb-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex flex-col overflow-hidden max-w-[85%] w-full">
                            <Marquee text={props.details.name ? props.details.name.replace(/&quot;/g, '"') : ''} className="text-2xl font-bold text-white mb-1" />
                            <p className="text-lg text-gray-400 truncate text-left">
                                {props.details.artists?.primary?.map(a => a.name).join(', ') || props.details.primaryArtists || 'Unknown'}
                            </p>
                        </div>
                        {/* Download Button (Mobile Prominent) */}
                        <button onClick={downloadSong} className="text-gray-400 hover:text-[#1db954] p-2" title="Download">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Scrubber */}
                <div className="mb-6">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={duration ? (currentTime / duration) * 100 : 0}
                        onChange={handleSeek}
                        className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:visible mb-2"
                        style={{
                            background: `linear-gradient(to right, #ffffff ${duration ? (currentTime / duration) * 100 : 0}%, #535353 ${duration ? (currentTime / duration) * 100 : 0}%)`
                        }}
                    />
                    <div className="flex justify-between text-xs text-gray-400 font-medium font-mono">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between mb-8 px-4">
                    <button
                        onClick={() => setIsShuffle(!isShuffle)}
                        className={`${isShuffle ? 'text-[#1db954]' : 'text-gray-400'} hover:text-white`}
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-7.5V10h-.25A.75.75 0 018 9.25v-1.5A.75.75 0 018.75 7H14a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0v-5.5H10V18a8 8 0 100-16z"></path></svg>
                    </button>

                    <button className="text-white hover:scale-110 transition-transform" onClick={handlePrev}>
                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M11 19l-7-7 7-7v14z"></path></svg>
                    </button>

                    <button
                        onClick={handlePlayPause}
                        className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                    >
                        {isPlaying ? (
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"></path></svg>
                        ) : (
                            <svg className="w-8 h-8 pl-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                        )}
                    </button>

                    <button className="text-white hover:scale-110 transition-transform" onClick={() => handleNext(false)}>
                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M4 19l7-7-7-7v14z"></path><path d="M13 5v14l7-7z"></path></svg>
                    </button>

                    <button
                        onClick={() => setRepeatMode((prev) => (prev + 1) % 3)}
                        className={`${repeatMode > 0 ? 'text-[#1db954]' : 'text-gray-400'} hover:text-white`}
                    >
                        <div className="relative">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            {repeatMode === 2 && <span className="absolute -top-1 -right-1 text-[10px] font-bold">1</span>}
                        </div>
                    </button>
                </div>
                {/* Desktop Specific Bottom row removed as it was duplicative for mobile context or needs to be hidden on mobile */}
                {/* We integrated download button next to title for mobile */}
            </div>

            {/* Mini Player */}
            <div
                className="fixed bottom-[70px] md:bottom-0 left-0 right-0 bg-black/60 backdrop-blur-xl backdrop-saturate-150 border-t border-white/10 text-white z-50 h-[72px] md:h-24 flex flex-col md:flex-row items-center justify-between px-4 pb-1 md:pb-0 transition-all duration-300 rounded-t-2xl md:rounded-none shadow-2xl md:shadow-none mx-2 md:mx-0"
                onClick={() => setIsFullScreen(true)}
            >
                {/* Progress Bar (Mobile: Top overlay, Desktop: Inline in center) */}
                <div className="md:hidden absolute top-0 left-4 right-4 h-[2px] bg-white/20 cursor-pointer group rounded-full overflow-hidden" onClick={(e) => { e.stopPropagation(); handleSeek(e); }}>
                    <div
                        className="h-full bg-[#1db954] relative shadow-[0_0_10px_rgba(29,185,84,0.5)]"
                        style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                    ></div>
                </div>

                <audio ref={audioRef} src={props.details.downloadUrl && props.details.downloadUrl.length > 0 ? (props.details.downloadUrl[props.details.downloadUrl.length - 1].url || '') : ''} />

                {/* Left: Song Info */}
                <div className="flex items-center flex-1 min-w-0 max-w-full md:max-w-[30%] mr-2 md:mr-4 pt-1 md:pt-0">
                    <img
                        src={props.details.image && props.details.image.length > 0 ? (props.details.image[props.details.image.length - 1].url || '') : ''}
                        alt="cover"
                        className="h-10 w-10 md:h-14 md:w-14 object-cover rounded-lg shadow-lg mr-3"
                        onError={(e) => { e.target.src = 'https://www.scdn.co/i/_global/twitter_card-default.jpg' }}
                    />
                    <div className="flex flex-col truncate pr-2 w-full justify-center">
                        <Marquee text={props.details.name ? props.details.name.replace(/&quot;/g, '"') : ''} className="text-sm font-semibold text-white leading-tight" />
                        <span className="text-[11px] md:text-xs text-gray-300 truncate font-medium">
                            {props.details.artists?.primary?.map(a => a.name).join(', ') || props.details.primaryArtists || 'Unknown'}
                        </span>
                    </div>
                </div>

                {/* Center: Controls (Mobile: Right aligned, simplified) */}
                <div className="flex items-center md:flex-col justify-center md:flex-1 w-auto pt-1 md:pt-0">
                    <div className="flex items-center gap-3 md:gap-6">
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsShuffle(!isShuffle); }}
                            className={`hidden md:block hover:text-white transition-colors ${isShuffle ? 'text-[#1db954]' : 'text-gray-400'}`}
                            title="Shuffle"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-7.5V10h-.25A.75.75 0 018 9.25v-1.5A.75.75 0 018.75 7H14a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0v-5.5H10V18a8 8 0 100-16z"></path></svg>
                        </button>

                        <button className="text-gray-300 hover:text-white transition-transform active:scale-90" onClick={(e) => { e.stopPropagation(); handlePrev(); }}>
                            <svg className="w-7 h-7 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11 19l-7-7 7-7v14z"></path></svg>
                        </button>

                        <button
                            onClick={(e) => { e.stopPropagation(); handlePlayPause(); }}
                            className="w-10 h-10 md:w-8 md:h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
                        >
                            {isPlaying ? (
                                <svg className="w-5 h-5 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"></path></svg>
                            ) : (
                                <svg className="w-5 h-5 md:w-5 md:h-5 pl-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                            )}
                        </button>

                        <button className="text-gray-300 hover:text-white transition-transform active:scale-90" onClick={(e) => { e.stopPropagation(); handleNext(false); }}>
                            <svg className="w-7 h-7 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4 19l7-7-7-7v14z"></path><path d="M13 5v14l7-7z"></path></svg>
                        </button>

                        <button
                            onClick={(e) => { e.stopPropagation(); setRepeatMode((prev) => (prev + 1) % 3); }}
                            className={`hidden md:block hover:text-white transition-colors ${repeatMode > 0 ? 'text-[#1db954]' : 'text-gray-400'}`}
                            title={repeatMode === 2 ? "Repeat One" : (repeatMode === 1 ? "Repeat All" : "Repeat Off")}
                        >
                            <div className="relative">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                {repeatMode === 2 && <span className="absolute -top-1 -right-1 text-[10px] font-bold">1</span>}
                            </div>
                        </button>
                    </div>

                    {/* Scrubber (Desktop Only) */}
                    <div className="hidden md:flex w-full items-center justify-center gap-2 text-xs text-gray-400 font-mono mt-1" onClick={(e) => e.stopPropagation()}>
                        <span>{formatTime(currentTime)}</span>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={duration ? (currentTime / duration) * 100 : 0}
                            onChange={handleSeek}
                            className="w-full h-1 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:visible"
                            style={{
                                background: `linear-gradient(to right, #ffffff ${duration ? (currentTime / duration) * 100 : 0}%, #535353 ${duration ? (currentTime / duration) * 100 : 0}%)`
                            }}
                        />
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Right: Volume & Download (Desktop Only) */}
                <div className="hidden md:flex items-center justify-end w-[30%] gap-4" onClick={(e) => e.stopPropagation()}>
                    <button onClick={downloadSong} className="text-gray-400 hover:text-white transition-colors" title="Download Song">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </button>


                    <div className="flex items-center gap-2 w-24">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-full h-1 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:visible"
                            style={{
                                background: `linear-gradient(to right, #ffffff ${volume * 100}%, #535353 ${volume * 100}%)`
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}


export default Player
