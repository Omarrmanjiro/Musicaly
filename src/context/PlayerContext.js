import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const soundRef = useRef(null);
  const queueRef = useRef([]);
  const indexRef = useRef(0);
  const repeatRef = useRef("off");

  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off"); // off | one | all

  // Sync refs with state
  useEffect(() => {
    queueRef.current = queue;
    indexRef.current = currentIndex;
    repeatRef.current = repeatMode;
  }, [queue, currentIndex, repeatMode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  async function playTrack(track, newQueue = []) {
    if (!track?.preview) return;

    // Stop previous
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    if (newQueue.length) {
      setQueue(newQueue);
      const idx = newQueue.findIndex(t => t.id === track.id);
      setCurrentIndex(idx >= 0 ? idx : 0);
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri: track.preview },
      { shouldPlay: true }
    );

    soundRef.current = sound;
    setIsPlaying(true);

    sound.setOnPlaybackStatusUpdate(status => {
      if (!status.isLoaded) return;

      setProgress(status.positionMillis / 1000);
      setDuration(status.durationMillis / 1000);
      setIsPlaying(status.isPlaying);

      if (status.didJustFinish) {
        handleEnd();
      }
    });
  }

  function handleEnd() {
    const queue = queueRef.current;
    const index = indexRef.current;
    const repeat = repeatRef.current;

    if (repeat === "one") {
      soundRef.current?.setPositionAsync(0);
      soundRef.current?.playAsync();
      return;
    }

    if (index + 1 < queue.length) {
      playTrack(queue[index + 1], queue);
      setCurrentIndex(index + 1);
      return;
    }

    if (repeat === "all" && queue.length) {
      playTrack(queue[0], queue);
      setCurrentIndex(0);
    }
  }

  async function togglePlay() {
    if (!soundRef.current) return;

    if (isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }
    setIsPlaying(p => !p);
  }

  async function seek(seconds) {
    if (!soundRef.current) return;
    await soundRef.current.setPositionAsync(seconds * 1000);
  }

  function toggleShuffle() {
    setIsShuffle(s => !s);
  }

  function toggleRepeat() {
    setRepeatMode(r => (r === "off" ? "one" : r === "one" ? "all" : "off"));
  }

  async function next() {
    const idx = indexRef.current;
    if (idx + 1 < queueRef.current.length) {
      playTrack(queueRef.current[idx + 1], queueRef.current);
      setCurrentIndex(idx + 1);
    }
  }

  async function previous() {
    if (progress > 3) {
      await soundRef.current?.setPositionAsync(0);
      return;
    }

    const idx = indexRef.current;
    if (idx > 0) {
      playTrack(queueRef.current[idx - 1], queueRef.current);
      setCurrentIndex(idx - 1);
    }
  }

  return (
    <PlayerContext.Provider
      value={{
        playTrack,
        togglePlay,
        next,
        previous,
        isPlaying,
        progress,
        duration,
        seek,
        toggleShuffle,
        toggleRepeat,
        isShuffle,
        repeatMode,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside PlayerProvider");
  return ctx;
}
