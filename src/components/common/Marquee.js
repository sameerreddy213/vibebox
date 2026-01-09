import React, { useEffect, useRef, useState } from 'react';

const Marquee = ({ text, className = "" }) => {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        const checkOverflow = () => {
            const container = containerRef.current;
            const textElem = textRef.current;
            if (container && textElem) {
                // Check if the text element width is greater than the container width
                if (textElem.scrollWidth > container.clientWidth) {
                    setIsOverflowing(true);
                } else {
                    setIsOverflowing(false);
                }
            }
        };

        // Initial Check
        checkOverflow();

        // Re-check on resize
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [text]);

    return (
        <div
            ref={containerRef}
            className={`overflow-hidden whitespace-nowrap ${className}`}
        >
            {isOverflowing ? (
                <div className="inline-block animate-marquee will-change-transform">
                    <span className="mr-8">{text}</span>
                    <span className="mr-8">{text}</span>
                </div>
            ) : (
                <div ref={textRef} className="truncate">
                    {text}
                </div>
            )}
        </div>
    );
};

export default Marquee;
