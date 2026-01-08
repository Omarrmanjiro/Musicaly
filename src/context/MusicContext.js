import React, { createContext, useState, useContext } from "react";

const MusicContext = createContext(null);

export const MusicProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);

  // Normalize Deezer track BEFORE saving
  const playFromDeezer = (deezerTrack) => {
    if (!deezerTrack) return;

    setCurrentTrack({
      id: deezerTrack.id,
      title: deezerTrack.title,
      artist: deezerTrack.artist?.name ?? "Unknown Artist",
      artwork:
        deezerTrack.album?.cover_big ||
        deezerTrack.album?.cover_medium ||
        null,
      preview: deezerTrack.preview,
      playlist: "Deezer",
    });
  };

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        setCurrentTrack,
        playFromDeezer,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used inside MusicProvider");
  return ctx;
};
