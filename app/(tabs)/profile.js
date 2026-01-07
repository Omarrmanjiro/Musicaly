import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native"
import { useEffect, useState } from "react"
import * as ImagePicker from "expo-image-picker"

import { auth, db, storage } from "../../src/services/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

export default function ProfileScreen() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [phone, setPhone] = useState("")
  const [photoURL, setPhotoURL] = useState(null)
  const [localImage, setLocalImage] = useState(null)

  const spotifyGreen = "#1DB954"

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setLoading(false)
        return
      }

      setUser(u)

      const refDoc = doc(db, "users", u.uid)
      const snap = await getDoc(refDoc)

      if (snap.exists()) {
        const data = snap.data()
        setName(data.displayName || "")
        setBio(data.bio || "")
        setPhone(data.phone || "")
        setPhotoURL(data.photoURL || null)
      }

      setLoading(false)
    })

    return unsub
  }, [])

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled) {
      setLocalImage(result.assets[0].uri)
    }
  }

  const uploadImage = async (uri) => {
    const response = await fetch(uri)
    const blob = await response.blob()

    const imageRef = ref(storage, `avatars/${user.uid}.jpg`)
    await uploadBytes(imageRef, blob)

    return await getDownloadURL(imageRef)
  }

  const saveProfile = async () => {
    try {
      let finalPhotoURL = photoURL

      if (localImage) {
        finalPhotoURL = await uploadImage(localImage)
        setPhotoURL(finalPhotoURL)
        setLocalImage(null)
      }

      const data = {
        displayName: name,
        bio,
        phone,
        photoURL: finalPhotoURL,
      }

      await setDoc(doc(db, "users", user.uid), data, { merge: true })

      setEditing(false)
      Alert.alert("Saved", "Profile updated successfully")
    } catch (e) {
      Alert.alert("Error", e.message)
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={spotifyGreen} />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={editing ? pickImage : null}>
            <Image
              source={{
                uri:
                  localImage ||
                  photoURL 
              }}
              style={styles.avatar}
            />
            {editing && <Text style={styles.changeText}>Change photo</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            editable={editing}
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholder="Your name"
            placeholderTextColor="#777"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            editable={editing}
            value={bio}
            onChangeText={setBio}
            style={[styles.input, styles.multiline]}
            multiline
            placeholder="Tell something about you"
            placeholderTextColor="#777"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Phone number</Text>
          <TextInput
            editable={editing}
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            keyboardType="phone-pad"
            placeholder="+212..."
            placeholderTextColor="#777"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: spotifyGreen }]}
          onPress={editing ? saveProfile : () => setEditing(true)}
        >
          <Text style={styles.buttonText}>
            {editing ? "Save Profile" : "Edit Profile"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#333",
  },
  changeText: {
    color: "#1DB954",
    marginTop: 10,
    fontWeight: "600",
  },
  field: {
    marginBottom: 20,
  },
  label: {
    color: "#b3b3b3",
    marginBottom: 6,
    fontSize: 13,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#333",
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  button: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    fontWeight: "bold",
    color: "#000",
  },
})
