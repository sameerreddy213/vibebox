import React, { useEffect } from 'react'

function SearchBox(props) {
    const showResults = () => {
        const query = document.getElementById("query").value
        props.setQuery(query)
    }

    // Voice Search Logic
    const startListening = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.start();

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById("query").value = transcript;
                props.setQuery(transcript);
            };

            recognition.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                alert("Voice search failed. Please try again.");
            };
        } else {
            alert("Voice search is not supported in this browser.");
        }
    }

    //Sets loading bar to 100 when the page fully renders:
    useEffect(() => {
        props.setProgress(0)
        props.setProgress(100)
        document.title = "Search - TuneStation"
    }, [])

    return (
        <section className="text-black dark:text-gray-400 bg-light-100 dark:bg-deep-900 body-font">
            <div className="container px-5 py-5 mx-auto hidden md:block">
                <div className="text-center mb-10">
                    <h1 className="sm:text-3xl text-2xl font-bold title-font text-black dark:text-white mb-4">Search VibeBox</h1>
                    <p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto text-black dark:text-gray-400 text-opacity-80">
                        Find songs, artists, albums, or playlists.
                    </p>
                </div>
            </div>

            <div className="container px-5 py-0 mx-auto">
                <div className="flex w-full md:w-2/3 lg:w-1/2 flex-col sm:flex-row mx-auto items-stretch gap-4">
                    <div className="relative flex-grow w-full flex items-center">
                        <input
                            type="text"
                            id="query"
                            name="query"
                            defaultValue={props.initialValue}
                            onChange={(e) => {
                                props.setQuery(e.target.value);
                            }}
                            placeholder="What do you want to listen to?"
                            className="w-full bg-white/10 backdrop-blur-md rounded-full border border-white/10 focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954] text-base outline-none text-white py-3 pl-6 pr-12 leading-8 transition-colors duration-200 ease-in-out placeholder-gray-400 shadow-lg"
                        />
                        {/* Mic Icon */}
                        <button
                            onClick={startListening}
                            className="absolute right-4 text-gray-400 hover:text-[#1db954] transition-colors"
                            title="Search by Voice"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SearchBox
