import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { MusicProvider } from '../src/context/MusicContext';
import CustomDrawer from '../src/components/CustomDrawer';

export default function RootLayout() {
    return (
        <MusicProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Drawer
                    drawerContent={(props) => <CustomDrawer {...props} />}
                    screenOptions={{
                        headerShown: false,
                        drawerStyle: { backgroundColor: '#121212', width: '80%' },
                        drawerType: 'front', // Slide over content
                    }}
                >
                    {/* 1. THE TABS (Main App) */}
                    <Drawer.Screen
                        name="(tabs)"
                        options={{
                            drawerLabel: 'Home'
                        }}
                    />

                    {/* 2. THE AUTH (Login) - LOCKED */}
                    <Drawer.Screen
                        name="(auth)"
                        options={{
                            drawerItemStyle: { display: 'none' }, // Hide from menu
                            swipeEnabled: false, // Disable swipe gesture
                        }}
                    />
                </Drawer>
            </GestureHandlerRootView>
        </MusicProvider>
    );
}