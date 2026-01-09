const https = require('https');

const get = (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });
};

const run = async () => {
    try {
        console.log("Searching for song...");
        const search = await get('https://jio-savan-unofficial-api.vercel.app/api/search?query=Believer');
        const songId = search.data.songs.results[0].id;
        console.log("Found Song ID:", songId);

        console.log("Testing /lyrics?id=...");
        try {
            const lyrics1 = await get(`https://jio-savan-unofficial-api.vercel.app/lyrics?id=${songId}`);
            console.log("Result 1:", lyrics1);
        } catch (e) { console.log("Error 1:", e.message); }

        console.log("Testing /api/lyrics?id=...");
        try {
            const lyrics2 = await get(`https://jio-savan-unofficial-api.vercel.app/api/lyrics?id=${songId}`);
            console.log("Result 2:", lyrics2);
        } catch (e) { console.log("Error 2:", e.message); }

    } catch (e) {
        console.error("Script failed:", e);
    }
};

run();
