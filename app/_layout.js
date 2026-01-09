import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { AuthProvider } from '../src/context/AuthContext';
import { MusicProvider } from '../src/context/MusicContext';
import { PlayerProvider } from '../src/context/PlayerContext';
import CustomDrawer from '../src/components/CustomDrawer';
import MiniPlayer from './(tabs)/MiniPlayer';

export default function RootLayout() {
    return (
      <AuthProvider>
        <MusicProvider>
          <PlayerProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              
              {/* MAIN APP */}
              <Drawer
                drawerContent={(props) => <CustomDrawer {...props} />}
                screenOptions={{
                  headerShown: false,
                  drawerStyle: { backgroundColor: '#121212', width: '80%' },
                  drawerType: 'front',
                }}
              >
                <Drawer.Screen name="(tabs)" options={{ drawerLabel: 'Home' }} />
                <Drawer.Screen
                  name="(auth)"
                  options={{
                    drawerItemStyle: { display: 'none' },
                    swipeEnabled: false,
                  }}
                />
              </Drawer>
  
              {/* 🎵 MINI PLAYER (ALWAYS VISIBLE) */}
              <MiniPlayer />
  
            </GestureHandlerRootView>
          </PlayerProvider>
        </MusicProvider>
      </AuthProvider>
    );
  }
  
