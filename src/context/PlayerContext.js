import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";
import { Alert } from "react-native"; // <--- 1. ADD THIS IMPORT

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const soundRef = useRef(null);
  const queueRef = useRef([]);
  const indexRef = useRef(0);
  const repeatRef = useRef("off");

  const [isExpanded, setIsExpanded] = useState(false);

  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off");

  /* ---------------- SYNC REFS ---------------- */
  useEffect(() => {
    queueRef.current = queue;
    indexRef.current = currentIndex;
    repeatRef.current = repeatMode;
  }, [queue, currentIndex, repeatMode]);

  /* ---------------- CLEANUP ---------------- */
  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  /* ---------------- PLAY TRACK ---------------- */
async function playTrack(rawTrack, newQueue = []) {
     // 1. Validation
     if (!rawTrack?.preview) {
       Alert.alert("Unavailable", "This song has no preview URL.");
       return false; // Return false to indicate failure
    }

     // 2. Normalization
     const track = {
     ...rawTrack,
     id: rawTrack.id,
     title: rawTrack.title,
     artist: typeof rawTrack.artist === 'object' ? rawTrack.artist : { name: rawTrack.artist },
     cover: rawTrack.cover || rawTrack.album?.cover_medium || rawTrack.album?.cover_big,
     preview: rawTrack.preview
     };

     // 3. Stop previous sound
     try {
     if (soundRef.current) {
     await soundRef.current.unloadAsync();
     soundRef.current = null;
    }
     } catch (e) {
    console.log("Error unloading previous sound", e);
     }

    // 4. Update Queue State
     if (newQueue.length) {
       setQueue(newQueue);
       const idx = newQueue.findIndex(t => t.id === track.id);
       setCurrentIndex(idx >= 0 ? idx : 0);
     } else {
     setQueue([track]);
     setCurrentIndex(0);
   }

     // 5. Load & Play New Sound
    try {
      const { sound } = await Audio.Sound.createAsync(
       { uri: track.preview },
       { shouldPlay: true }
      );

      soundRef.current = sound;
      setIsPlaying(true);
       setIsExpanded(true);

       sound.setOnPlaybackStatusUpdate(status => {
       if (!status.isLoaded) return;

         setProgress(status.positionMillis / 1000);
         setDuration(status.durationMillis / 1000);
         setIsPlaying(status.isPlaying);

         if (status.didJustFinish) {
        handleEnd();
      }
     });
      
      return true; // Success!

   } catch (error) {
     // ✅ CHANGED: Use warn instead of error to prevent Red Screen
    console.warn("Failed to load sound (403/Expired):", track.title);
     setIsPlaying(false);
      
      // Optional: Inform user, but don't crash
      Alert.alert(
       "Song Expired", 
      `The link for "${track.title}" has expired. Please remove and re-add it.`
    );
      return false; // Failed
   }
 }
  /* ---------------- TRACK END ---------------- */
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
      // Ensure we don't crash the promise chain
      playTrack(queue[index + 1], queue).catch(e => console.log("Next track failed", e));
      setCurrentIndex(index + 1);
      return;
    }

    if (repeat === "all" && queue.length) {
      playTrack(queue[0], queue).catch(e => console.log("Loop track failed", e));
      setCurrentIndex(0);
    }
  }

  /* ---------------- CONTROLS ---------------- */
  async function togglePlay() {
    if (!soundRef.current) return;
    const shouldPlay = !isPlaying;
    setIsPlaying(shouldPlay);

    try {
      if (shouldPlay) {
        await soundRef.current.playAsync();
      } else {
        await soundRef.current.pauseAsync();
      }
    } catch (error) {
      console.log("Error toggling play:", error);
      setIsPlaying(!shouldPlay);
    }
  }

  async function seek(seconds) {
    if (!soundRef.current) return;
    try {
        await soundRef.current.setPositionAsync(seconds * 1000);
    } catch (e) { console.log("Seek error", e); }
  }

  function toggleShuffle() {
    setIsShuffle(s => !s);
  }

  function toggleRepeat() {
    setRepeatMode(r =>
      r === "off" ? "one" : r === "one" ? "all" : "off"
    );
  }

  async function next() {
    const idx = indexRef.current;
    if (idx + 1 < queueRef.current.length) {
      playTrack(queueRef.current[idx + 1], queueRef.current);
      setCurrentIndex(idx + 1);
    }
  }

async function previous() {
    // If playing and more than 3 seconds in, restart song
     if (progress > 3) {
       await soundRef.current?.setPositionAsync(0);
    return;
    }

     const idx = indexRef.current;
    if (idx > 0) {
      // ✅ Update index immediately for UI responsiveness
      setCurrentIndex(idx - 1);
      
      // Attempt to play
      const success = await playTrack(queueRef.current[idx - 1], queueRef.current);
      
      // If failed (403), you might want to auto-skip further back? 
      // For now, the Alert in playTrack will handle notification.
    }
   }

  return (
    <PlayerContext.Provider
      value={{
        isExpanded,
        setIsExpanded,
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
        currentTrack: queue[currentIndex],
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