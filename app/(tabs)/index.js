import { View, Text } from "react-native";
import { useAuth } from "../../src/context/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!user) {
    return <Text>Not logged in</Text>;
  }

  return (
    <View>
      <Text>Welcome {user.email}</Text>
    </View>
  );
}
