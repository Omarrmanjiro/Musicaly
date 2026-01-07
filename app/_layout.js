import { Stack } from "expo-router";
import { AuthProvider } from "../src/context/AuthContext";
import { MockPlayerProvider } from "../src/context/MockPlayerContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <MockPlayerProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </MockPlayerProvider>
    </AuthProvider>
  );
}
