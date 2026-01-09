import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import Items from '../common/Items';

function Results(props) { // query

    const navigate = useNavigate(); //for navigating to /listen

    // Search for the song once the component renders
    useEffect(() => {
        search(props.query)
        document.title = `'${props.query}' - VibeBox`
    }, [props.query])

    const [results, setResults] = useState([]) //the results obtained from search()

    /**
     * Takes song name and searches for results from API
     * @param {string} songname 
     */
    const search = async (songname) => {
        try {
            props.setProgress(20)

            const query = songname.replaceAll(" ", "+")

            // Use /api/search endpoint according to API spec
            const uri = `/api/search?query=${query}`
            props.setProgress(40)

            const response = await fetch(uri)
            if (!response.ok) {
                throw new Error(`Search API returned ${response.status}`)
            }

            const contentType = response.headers.get('content-type')
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Response is not JSON')
            }

            props.setProgress(60)
            const resp = await response.json()

            // According to API spec: {success: boolean, data: {albums: {...}, songs: {...}, playlists: {...}, topQuery: {...}}}
            if (!resp.success || !resp.data) {
                throw new Error('Invalid API response structure')
            }

            const topMatch = resp.data.topQuery?.results || []
            const songs = resp.data.songs?.results || []
            const albums = resp.data.albums?.results || []
            const playlists = resp.data.playlists?.results || []

            let raw_results = [...topMatch, ...songs, ...albums, ...playlists]

            let uniqueKeys = new Set();
            let results = []

            // Checking for any duplicate results and removing artists
            raw_results.forEach(obj => {
                if (obj && obj.type !== "artist") {
                    // Filter by type if specified
                    if (props.type && props.type.toLowerCase() === 'playlist') {
                        if (obj.type.toLowerCase() !== 'playlist') return;
                    }

                    if (!uniqueKeys.has(obj.id)) {
                        results.push(obj);
                        uniqueKeys.add(obj.id);
                    }
                }
            });

            props.setProgress(100)
            setResults(results)
        } catch (error) {
            console.error("Search error:", error)
            props.setProgress(100)
            setResults([])
            alert(`Error searching: ${error.message}. Please check the browser console for more details.`)
        }
    }

    const getSongDetails = async (songId) => {
        try {
            // According to API spec: /api/songs?ids={id}
            const uri = `/api/songs?ids=${songId}`

            props.setProgress(30)
            const response = await fetch(uri)

            if (!response.ok) {
                throw new Error(`Song API returned ${response.status}`)
            }

            const contentType = response.headers.get('content-type')
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Response is not JSON')
            }

            props.setProgress(50)
            const resp = await response.json()
            props.setProgress(70)

            // According to API spec: {success: boolean, data: array}
            if (!resp.success || !resp.data || !Array.isArray(resp.data) || resp.data.length === 0) {
                throw new Error('Invalid song response structure')
            }

            props.setProgress(100)
            return resp.data[0] // First song in array
        } catch (error) {
            console.error("Error fetching song details from API:", error)
            props.setProgress(100)
            throw error; // Re-throw to be caught by the caller
        }
    }



    return (
        <>
            <section className="text-black dark:text-gray-400 bg-light-100 dark:bg-deep-900 body-font">
                <div className="container px-5 py-8 mx-auto" id="blurred_results">
                    <div className="flex flex-col text-center w-full mb-10">
                        <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-black dark:text-white">Search Results: &#10075;<span
                            id="search_query" className="capitalize">{props.query}</span>&#10076;</h1>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4" id="results">
                        {results.map((song) => {
                            const isSong = song.type.toUpperCase() === "SONG";
                            return <Items
                                key={song.id}
                                song={song}
                                variant={'card'}
                                onClick={
                                    async () => {
                                        if (isSong) {
                                            let details = await getSongDetails(song.id)
                                            props.setDetails(details)
                                            // navigate("/listen") // No longer navigating, player is global
                                        }
                                        else if (song.type.toUpperCase() == "ALBUM") {
                                            props.setAlbumId(song.id)
                                            navigate("/albums")
                                        }
                                        else if (song.type.toUpperCase() == "PLAYLIST") {
                                            props.setPlaylistId(song.id)
                                            navigate("/playlists")
                                        }
                                    }
                                } />

                        })}
                    </div>


                </div>
            </section>
        </>
    )
}

export default Results
