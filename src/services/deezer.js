const BASE_URL = "https://corsproxy.io/?https://api.deezer.com";

export async function searchTracks(query) {
  const res = await fetch(`${BASE_URL}/search?q=${query}&limit=100`);
  const data = await res.json();

  return data.data.filter(track => track.preview);
}

//to fetch all data for search engine
export const searchAll = async (query) => {
    if (!query) return null;

    try {
        // We run 3 requests in parallel (at the same time) to be fast
        const [tracksResponse, albumsResponse, artistsResponse] = await Promise.all([
            fetch(`${BASE_URL}/search/track?q=${query}`),
            fetch(`${BASE_URL}/search/album?q=${query}`),
            fetch(`${BASE_URL}/search/artist?q=${query}`)
        ]);

        const tracks = await tracksResponse.json();
        const albums = await albumsResponse.json();
        const artists = await artistsResponse.json();

        // Return specific clean lists for each category
        return {
            tracks: tracks.data || [],
            albums: albums.data || [],
            artists: artists.data || []
        };

    } catch (error) {
        console.error("Error searching all:", error);
        return { tracks: [], albums: [], artists: [] };
    }
};


// to get the top playlists and songs and albums
export async function getChart() {
    const res = await fetch(`${BASE_URL}/chart`);
    const data = await res.json();

    // it returns tracks,albums and playlists
    return {
        tracks: data.tracks.data,
        albums: data.albums.data,
        playlists: data.playlists.data,
        artists : data.artists.data
    };
}

export const getCollectionDetails = async (type, id) => {
    try {
        let endpoint = '';

        // Deezer uses different URL patterns for different types
        if (type === 'album') {
            endpoint = `/album/${id}/tracks`;
        } else if (type === 'playlist') {
            endpoint = `/playlist/${id}/tracks`;
        } else if (type === 'artist') {
            endpoint = `/artist/${id}/top?limit=50`; // Get top 50 songs for artist
        } else {
            return [];
        }

        const res = await fetch(`${BASE_URL}${endpoint}`);
        const json = await res.json();
        return json.data; // Returns the list of tracks
    } catch (error) {
        console.error("Error fetching details:", error);
        return [];
    }
}