import React, { useEffect, useState } from 'react';

function QuickGrid(props) {
    const [history, setHistory] = useState([]);
    const [greeting, setGreeting] = useState("Good Morning");

    const [suggestions, setSuggestions] = useState([]);

    const updateTimeBasedContent = () => {
        const hour = new Date().getHours();
        let newGreeting = "Good Morning";
        let newSuggestions = [];

        if (hour >= 5 && hour < 12) {
            newGreeting = "Good Morning";
            newSuggestions = [
                { id: 'morning_focus', name: 'Morning Focus', image: [{ url: 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=200&h=200&fit=crop' }], type: 'static' },
                { id: 'workout', name: 'Workout Mode', image: [{ url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop' }], type: 'static' },
                { id: 'acoustic', name: 'Acoustic Chill', image: [{ url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=200&h=200&fit=crop' }], type: 'static' },
                { id: 'motivation', name: 'Motivation Mix', image: [{ url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&h=200&fit=crop' }], type: 'static' }
            ];
        } else if (hour >= 12 && hour < 17) {
            newGreeting = "Good Afternoon";
            newSuggestions = [
                { id: 'pop_hits', name: 'Pop Hits', image: [{ url: 'https://images.unsplash.com/photo-1514525253440-b393452e3383?w=200&h=200&fit=crop' }], type: 'static' },
                { id: 'lofi', name: 'Lo-Fi Chill', image: [{ url: 'https://images.unsplash.com/photo-1507838153414-b4b713384ebd?w=200&h=200&fit=crop' }], type: 'static' },
                { id: 'road_trip', name: 'Road Trip', image: [{ url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=200&h=200&fit=crop' }], type: 'static' },
                { id: 'feel_good', name: 'Feel Good', image: [{ url: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=200&h=200&fit=crop' }], type: 'static' }
            ];
        } else {
            newGreeting = "Good Evening";
            newSuggestions = [
                { id: 'party', name: 'Party Hits', image: [{ url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=200&h=200&fit=crop' }], type: 'static' },
                { id: 'romance', name: 'Romantic Vibes', image: [{ url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=200&h=200&fit=crop' }], type: 'static' },
                { id: 'sleep', name: 'Sleep Sounds', image: [{ url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200&h=200&fit=crop' }], type: 'static' },
                { id: 'night_drive', name: 'Night Drive', image: [{ url: 'https://images.unsplash.com/photo-1495615080073-6b89c9839ce0?w=200&h=200&fit=crop' }], type: 'static' }
            ];
        }

        setGreeting(newGreeting);
        setSuggestions(newSuggestions);
    };

    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem('recentlyPlayed') || '[]');
        setHistory(storedHistory.slice(0, 6)); // Top 6 items

        // Initial set
        updateTimeBasedContent();

        // Update every minute to catch hour changes (e.g. crossing noon while app is open)
        const interval = setInterval(updateTimeBasedContent, 60000);

        return () => clearInterval(interval);
    }, []);

    // Mix history with time-based suggestions if history is empty
    // If history has items, we can either:
    // 1. Show only history (current behavior)
    // 2. Mix history + suggestions to fill 6 slots (Better UX)

    // Let's implement mixing: Fill up to 6 slots
    let itemsToShow = [...history];
    if (itemsToShow.length < 6) {
        // Append suggestions not already in history (by name loosely)
        const needed = 6 - itemsToShow.length;
        const extra = suggestions.slice(0, needed);
        itemsToShow = [...itemsToShow, ...extra];
    }

    if (itemsToShow.length === 0) return null;

    return (
        <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight">{greeting}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {itemsToShow.map((item, index) => {
                    const imgUrl = (item.image && item.image.length > 0 && (item.image[2]?.url || item.image[0].url))
                        ? (item.image[2]?.url || item.image[0].url)
                        : 'https://www.scdn.co/i/_global/twitter_card-default.jpg';

                    return (
                        <div
                            key={item.id + index}
                            onClick={() => {
                                if (item.type === 'static') {
                                    // Handle static category click - navigate to search
                                    // props.onCategoryClick(item.name) // Need to pass this prop or use navigate
                                    window.location.href = `/search?q=${item.name}`; // Simple redirect or use navigate hook if passed
                                } else {
                                    props.onPlay(item);
                                }
                            }}
                            className="bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/5 hover:border-white/10 rounded overflow-hidden flex items-center cursor-pointer transition-all duration-300 group shadow-sm hover:shadow-md"
                        >
                            <img
                                src={imgUrl}
                                alt={item.name}
                                className="h-16 w-16 md:h-20 md:w-20 object-cover shadow-r-lg"
                            />
                            <div className="p-3 md:p-4 flex-1 min-w-0 flex justify-between items-center">
                                <span className="font-bold text-white text-xs md:text-sm truncate pr-2 line-clamp-2 leading-tight">
                                    {item.name.replace(/&quot;/g, '"')}
                                </span>

                                {/* Play Button appearing on hover */}
                                <div className="bg-[#1db954] rounded-full p-2 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hidden md:block">
                                    <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default QuickGrid;
