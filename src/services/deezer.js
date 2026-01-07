const BASE_URL = "https://corsproxy.io/?https://api.deezer.com";

export async function searchTracks(query) {
  const res = await fetch(`${BASE_URL}/search?q=${query}&limit=100`);
  const data = await res.json();

  return data.data.filter(track => track.preview);
}
