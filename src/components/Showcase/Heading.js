import React from 'react'

function Heading(props) {
    return (
        // The label for Showcase of songs and albums 
        <div className="flex flex-row justify-between items-center w-full mb-2 px-4 md:px-0">
            <h1 className="text-2xl md:text-3xl font-bold title-font text-white mb-4">{props.title}</h1>
            {props.onViewMore && (
                <button
                    onClick={props.onViewMore}
                    className="hidden md:block text-sm font-semibold text-gray-400 hover:text-white mb-4 uppercase tracking-wider focus:outline-none"
                    title={props.isExpanded ? "Show Less" : "Show More"}
                >
                    {props.isExpanded ? "View Less" : "View More"}
                </button>
            )}
        </div>

    )
}

export default Heading
