// --- PROJECT ETHAN: GLOBAL REAL-TIME SYNC ---

export const fetchGlobalPulse = async () => {
    try {
        // Fetching Tech/Space News as it fits Ethan's persona
        const response = await fetch("https://api.spaceflightnewsapi.net/v4/articles/?limit=5");
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            const headlines = data.results.map(art => `- ${art.title}`).join('\n');
            console.log("Ethan: Global Pulse Synced.");
            return headlines;
        }
        return "No breaking tech news at this moment, Sir.";
    } catch (error) {
        console.warn("Ethan: Global Pulse Sync Failed. Falling back to internal data.");
        return "Global news sync is currently offline, Sir.";
    }
};
