import React, { useEffect } from 'react'

function SearchBox(props) {
    const showResults = () => {
        const query = document.getElementById("query").value
        props.setQuery(query)
    }

    //Sets loading bar to 100 when the page fully renders:
    useEffect(() => {
        props.setProgress(0)
        props.setProgress(100)
        document.title = "Search - TuneStation"
    }, [])

    return (
        <section className="md:mt-10 text-black dark:text-gray-400 bg-light-100 dark:bg-deep-900 body-font">
            <div className="container px-5 py-5 mx-auto">
                <div className="text-center mb-10">
                    <h1 className="sm:text-3xl text-2xl font-bold title-font text-black dark:text-white mb-4">Search VibeBox</h1>
                    <p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto text-black dark:text-gray-400 text-opacity-80">
                        Find songs, artists, albums, or playlists.
                    </p>
                </div>
            </div>

            <div className="container px-5 py-0 mx-auto">
                <div className="flex w-full md:w-2/3 lg:w-1/2 flex-col sm:flex-row mx-auto items-stretch gap-4">
                    <div className="relative flex-grow w-full">
                        <input
                            type="text"
                            id="query"
                            name="query"
                            placeholder="What do you want to listen to?"
                            className="w-full bg-[#181818] rounded-full border border-[#282828] focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954] text-base outline-none text-white py-3 px-6 leading-8 transition-colors duration-200 ease-in-out placeholder-gray-500 shadow-md"
                        />
                    </div>
                    <button
                        id="searchBtn"
                        onClick={showResults}
                        className="text-black bg-white hover:bg-gray-200 border-0 py-3 px-8 focus:outline-none rounded-full text-lg font-semibold shadow-md transition-transform active:scale-95"
                    >
                        Search
                    </button>
                </div>
            </div>
        </section>
    )
}

export default SearchBox
