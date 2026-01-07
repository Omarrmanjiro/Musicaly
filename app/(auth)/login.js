import { View, Text, Button, StyleSheet } from "react-native";
import { auth } from "../../src/services/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function LoginScreen() {
  const email = "test1@gmail.com";
  const password = "123456";

  const handleRegister = async () => {
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("REGISTER SUCCESS:", res.user.uid);
    } catch (err) {
      console.log("REGISTER ERROR:", err.code, err.message);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("LOGIN SUCCESS:", res.user.uid);
    } catch (err) {
      console.log("LOGIN ERROR:", err.code, err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Auth Test</Text>

      <Button title="REGISTER (once)" onPress={handleRegister} />
      <Button title="LOGIN" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: "center",
  },
});
