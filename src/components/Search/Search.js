import React, { useState, useEffect } from 'react'
import { useSearchParams } from "react-router-dom";
// import Player from './Player'
import Results from './Results'
import SearchBox from './SearchBox'

function Search(props) {
    const [searchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("q"));

    useEffect(() => {
        const q = searchParams.get("q");
        if (q) setQuery(q);
    }, [searchParams]);
    return (
        <div className={props.theme}>
            <div className="py-24">

                <SearchBox setQuery={setQuery} setProgress={props.setProgress} initialValue={query} />
                {query && <Results query={query} type={searchParams.get("type")} setProgress={props.setProgress} setDetails={props.setDetails} setAlbumId={props.setAlbumId} setPlaylistId={props.setPlaylistId} />}

            </div>
        </div>
    )
}

export default Search
