import { db, auth } from "../config/firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc, arrayUnion } from "firebase/firestore";

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

export const addSongToPlaylist = async (playlistId, track) => {
    try {
        const PlaylistRef = doc(db, "playlists", playlistId);
        const songData = {
            id: track.id,
            title: track.title,
            artist: track.artist.name,
            cover: track.album.cover_medium,
            preview: track.preview || null
        }

        await updateDoc(PlaylistRef, { songs: arrayUnion(songData) });
    } catch (e) {
        console.error("error adding song", e);
        throw e;
    }

} 