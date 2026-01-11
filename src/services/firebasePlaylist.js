import { db, auth } from "../config/firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc, arrayUnion, query, where, getDocs  } from "firebase/firestore";

export const createPlaylist = async (playlistName) => {

    try {
        const user = auth.currentUser;
        const docRef = await addDoc(collection(db, "playlists"), {
            name: playlistName,
            userId: user.uid,
            createdAt: serverTimestamp(),
            songs: []
        });

        console.log("playlist created with ID :", docRef.id);
        return docRef.id

    } catch (e) {
        console.error("Error creating playlist", e);
    }
}

// src/services/firebasePlaylist.js

export const addSongToPlaylist = async (playlistId, track) => {
    try {
        const PlaylistRef = doc(db, "playlists", playlistId);

        // FIX: We use '?' to safely check if album exists before asking for the cover
        // We also allow fallbacks (track.cover or track.cover_medium) just in case
        const songData = {
            id: track.id,
            title: track.title,
            artist: track.artist ? track.artist.name : "Unknown Artist",
            cover: track.album?.cover_medium || track.cover || track.cover_medium || null,
            preview: track.preview || null
        }

        await updateDoc(PlaylistRef, { songs: arrayUnion(songData) });
    } catch (e) {
        console.error("error adding song", e);
        throw e;
    }
}

export const getUserPlaylists = async () => {
    try {
        const user = auth.currentUser;
        if (!user) return [];

        // Ask Firebase for playlists where userId matches the logged-in user
        const q = query(collection(db, "playlists"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const playlists = [];
        querySnapshot.forEach((doc) => {
            playlists.push({ id: doc.id, ...doc.data() });
        });
        return playlists;
    } catch (e) {
        console.error("Error fetching playlists", e);
        return [];
    }
};