import { View, Text } from "react-native";
import { useAuth } from "../../src/context/AuthContext";

export default function Home() {
  const { user, profile } = useAuth();

  if (!user) {
    return <Text>Not logged in</Text>;
  }

  return (
    <View>
      <Text>UID: {user.uid}</Text>
      <Text>Email: {user.email}</Text>
      <Text>Username: {profile?.username}</Text>
    </View>
  );
}
