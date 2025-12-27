import { Audio } from "expo-av";

let sound = null;

export async function playPreview(url) {
  if (!url) return;

  if (sound) {
    await sound.unloadAsync();
    sound = null;
  }

  sound = new Audio.Sound();
  await sound.loadAsync({ uri: url });
  await sound.playAsync();
}
