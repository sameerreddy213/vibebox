import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

import Heading from './Heading'
import Songs from './Songs'
import Albums from './Albums'
import Playlists from './Playlists';
import HeroSection from './HeroSection'; // New
import QuickGrid from './QuickGrid'; // New

function Showcase(props) {

    const navigate = useNavigate(); //for navigating to /listen

    const [tollywood_songs, setTollywoodSongs] = useState([])
    const [bollywood_songs, setBollywoodSongs] = useState([])
    const [trending_albums, setTrendingAlbums] = useState([])

    const [top_albums, setTopAlbums] = useState([])

    const [playlists, setPlaylists] = useState([])
    const [charts, setCharts] = useState([])
    const [telugu_playlists, setTeluguPlaylists] = useState([])

    // State to track limits for sections (Mobile Carousel / Desktop Grid)
    // Initial limit 6 items
    const [limits, setLimits] = useState({
        tollywood: 6,
        bollywood: 6,
        playlists: 6
    });

    const loadMore = (section) => {
        setLimits(prev => ({ ...prev, [section]: (prev[section] || 6) + 6 }));
    };

    const searchFromId = async (id) => {
        try {
            console.log("Fetching song with ID:", id); // Debugging
            const uri = `/api/songs?ids=${id}`

            const response = await fetch(uri)
            if (!response.ok) {
                throw new Error(`Song API returned ${response.status}`)
            }

            const contentType = response.headers.get('content-type')
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Response is not JSON')
            }

            const resp = await response.json()

            if (!resp.success || !resp.data || !Array.isArray(resp.data) || resp.data.length === 0) {
                throw new Error('Invalid song response structure')
            }

            props.setDetails(resp.data[0])
            props.setDetails(resp.data[0]) // Double set to ensure update? Kept from original logic.
        } catch (error) {
            console.error("Error fetching song:", error)
            alert(`Error loading song: ${error.message}`)
        }
    }

    /**
     * Main function that fetches homepage API sets the homepage data
     */
    const fetchSongsFromQuery = async (query) => {
        try {
            const searchUri = `/api/search?query=${encodeURIComponent(query)}`
            const response = await fetch(searchUri)
            const resp = await response.json()

            if (!resp.success || !resp.data) return [];
            const data = resp.data;

            // Try to get songs from the top playlist result
            if (data.playlists?.results && data.playlists.results.length > 0) {
                try {
                    const topPlaylistId = data.playlists.results[0].id;
                    const playlistUri = `/api/playlists?id=${topPlaylistId}&limit=20`;
                    const plResponse = await fetch(playlistUri);
                    const plResp = await plResponse.json();
                    if (plResp.success && plResp.data && plResp.data.songs) {
                        return getShowcase(plResp.data.songs, 'any', false);
                    }
                } catch (e) {
                    console.warn(`Failed to fetch playlist details for ${query}`, e);
                }
            }
            // Fallback to direct song search results
            if (data.songs?.results) {
                return getShowcase(data.songs.results, "song", false);
            }
            return [];
        } catch (e) {
            console.error("Error fetching songs for query:", query, e);
            return [];
        }
    }

    const setHomepageData = async () => {
        try {
            props.setProgress(30)

            // 1. Fetch Tollywood (Telugu) Trending
            const teluguSongs = await fetchSongsFromQuery("Telugu Top 50");
            setTollywoodSongs(teluguSongs);
            props.setProgress(50)

            // 2. Fetch Bollywood (Hindi) Trending
            const hindiSongs = await fetchSongsFromQuery("Hindi Top 50");
            setBollywoodSongs(hindiSongs);
            props.setProgress(70)



            // 5. Initialize "Tollywood Playlists" with static categories
            const categories = [
                { name: "Romance", keywords: "romance,couple" },
                { name: "Mass", keywords: "festival,crowd" },
                { name: "Lo-Fi", keywords: "lofi,chill" },
                { name: "Melody", keywords: "music,nature" },
                { name: "Party", keywords: "party,neon" },
                { name: "Sad", keywords: "lonely,dark" },
                { name: "Chill", keywords: "relax,coffee" },
                { name: "Devotional", keywords: "temple,god" },
                { name: "Folk", keywords: "village,culture" },
                { name: "Dance", keywords: "dance,club" },
                { name: "Retro", keywords: "vintage,vinyl" },
                { name: "Classical", keywords: "classical,instrument" },
            ];

            const staticPlaylists = categories.map((cat, index) => ({
                id: `cat_${index}`,
                name: cat.name,
                type: "playlist",
                // Use a random param to ensure different images for similar keywords if needed, though keywords differ.
                image: [{ url: `https://loremflickr.com/500/500/${cat.keywords}?random=${index}` }]
            }));

            setTeluguPlaylists(staticPlaylists);

            props.setProgress(100)
        } catch (error) {
            console.error("Error fetching homepage data:", error)
            props.setProgress(100)
        }
    }

    /**
     * Helper function for shuffling the array of songs/albums
     * @param {array} array Array of song/album to be shuffled
     * @returns shuffled array
     */
    const shuffle = (array) => {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    const handleCategoryClick = (category) => {
        navigate(`/search?q=Telugu ${category.name} Playlist&type=playlist`);
    }

    /**
     * Takes a list of songs/albums and returns it in the form of showcase
     * @param {Array} data The array of songs/albums of which to get the showcase
     * @param {String} type The type of data (song/album/playlist)
     * @param {Boolean} shouldShuffle Whether to shuffle the results
     * @returns the name, image, id of the data
     */
    const getShowcase = (data, type, shouldShuffle = true) => {
        let data_showcase = []
        let count = 0
        while (count < data.length) {
            if (data_showcase.length === 50) break // Fetch up to 50 items to allow for deep pagination
            // if song index exists:    
            if (data[count] && (data[count].type?.toLowerCase() == type?.toLowerCase() || type === 'any')) {
                let data_name = data[count]["name"] ? data[count]["name"] : data[count]["title"]

                let imageUrl = null
                if (data[count]["image"] && Array.isArray(data[count]["image"])) {
                    if (data[count]["image"].length > 2) {
                        imageUrl = data[count]["image"][2]?.url || data[count]["image"][data[count]["image"].length - 1]?.url
                    } else if (data[count]["image"].length > 0) {
                        imageUrl = data[count]["image"][data[count]["image"].length - 1]?.url
                    }
                }
                data_showcase.push({
                    name: data_name,
                    image: imageUrl,
                    id: data[count]["id"]
                })
            }
            count += 1
        }
        return shouldShuffle ? shuffle(data_showcase) : data_showcase;

    }


    useEffect(() => {
        document.body.scrollTop = document.documentElement.scrollTop = 0; //scroll to top of page
        document.title = "Home - VibeBox"
        setHomepageData()
    }, [])

    // Logic to select a "Hero" item (e.g., first trending song)
    const heroItem = tollywood_songs.length > 0 ? tollywood_songs[0] : null;


    return (
        <div className={props.theme}>
            <section className="text-black dark:text-gray-400 bg-light-100 dark:bg-deep-900 body-font justify-center py-0">
                <div className="w-full md:container md:mx-auto md:px-5 pb-24 mb-0">

                    {/* 1. Hero Section */}
                    <div className="px-4 md:px-0 pt-4 md:pt-8">
                        {heroItem && <HeroSection item={heroItem} onPlay={(item) => props.setDetails(item)} />}
                    </div>

                    {/* 2. Quick Access Grid (Good Morning/Recently Played) */}
                    <div className="px-4 md:px-0">
                        <QuickGrid onPlay={(item) => props.setDetails(item)} />
                    </div>

                    <div className="h-4 md:h-8"></div>

                    {/* 3. Content Lanes */}
                    <Heading
                        title="Tollywood Trending"
                        onViewMore={() => loadMore('tollywood')}
                    // onViewMore passed as fallback for desktop button if visible
                    />
                    <Songs
                        songs={tollywood_songs.slice(0, limits.tollywood)}
                        searchFromId={searchFromId}
                        layout="carousel"
                        hasMore={limits.tollywood < tollywood_songs.length}
                        onLoadMore={() => loadMore('tollywood')}
                    />

                    <div className="h-8 md:h-20"></div>

                    <Heading
                        title="Top Playlists"
                        onViewMore={() => loadMore('playlists')}
                    />
                    <Playlists
                        playlists={telugu_playlists.slice(0, limits.playlists)}
                        setPlaylistId={props.setPlaylistId}
                        onPlaylistClick={handleCategoryClick}
                        layout="carousel"
                        hasMore={limits.playlists < telugu_playlists.length}
                        onLoadMore={() => loadMore('playlists')}
                    />

                    <div className="h-8 md:h-20"></div>

                    <Heading
                        title="Bollywood Trending"
                        onViewMore={() => loadMore('bollywood')}
                    />
                    <Songs
                        songs={bollywood_songs.slice(0, limits.bollywood)}
                        searchFromId={searchFromId}
                        layout="carousel"
                        hasMore={limits.bollywood < bollywood_songs.length}
                        onLoadMore={() => loadMore('bollywood')}
                    />


                </div>
            </section>
        </div >
    )
}

export default Showcase
