import { View, Text, Button } from "react-native";
import { useAuth } from "../src/context/AuthContext";
/*
export default function TestAuth() {
  const { user, register, login, logout } = useAuth();

  const email = "testuser2@gmail.com";
  const password = "123456";

  return (
    <View style={{ padding: 30 }}>
      <Text>Auth Test</Text>

      <Text>
        Current user: {user ? user.email : "NOT LOGGED IN"}
      </Text>

      <Button
        title="REGISTER"
        onPress={() => register(email, password)}
      />

      <Button
        title="LOGIN"
        onPress={() => login(email, password)}
      />

      <Button
        title="LOGOUT"
        onPress={logout}
      />
    </View>
  );
}*/
