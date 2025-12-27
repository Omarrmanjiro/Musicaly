import { View, Text, Button } from "react-native";
import { useState } from "react";
import { searchTracks } from "../../src/services/deezer";
import { playPreview } from "../../src/services/audio";

export default function Home() {
  const [track, setTrack] = useState(null);

  async function search() {
    const results = await searchTracks("eminem");
    setTrack(results[0]);
  }

  return (
    <View style={{ padding: 20 }}>
      <Button title="Search" onPress={search} />

      {track && (
        <>
          <Text>{track.title}</Text>
          <Text>{track.artist.name}</Text>
          <Button
            title="Play Preview"
            onPress={() => playPreview(track.preview)}
          />
        </>
      )}
    </View>
  );
}
