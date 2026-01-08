import {View, Image,FlatList,Text,TextInput,Alert, Modal, TouchableOpacity,StyleSheet} from 'react-native';
import {SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { createPlaylist,addSongToPlaylist } from '../../src/services/firebasePlaylist';
import { auth, db } from '../../src/config/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import {IconSymbol} from '@/components/ui/icon-symbol';
import { useColorScheme } from 'react-native';
import { usePlayer } from '../../src/context/PlayerContext';
import { useMusic } from '../../src/context/MusicContext';



export default function PlaylistManager(){


    const[currentView, setCurrentView] = useState('list');
    const[Playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const[NewPlaylistName, setNewPlaylistName] = useState(""); 
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const[Loading, setLoading]= useState(true);
    const[deezerTracks, setDeezerTracks] = useState([]);
    
    const { setCurrentTrack } = useMusic();
    const { playTrack } = usePlayer();

    


    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const bg = isDark ? '#121212' : '#FFFFFF';
    const text = isDark ? '#FFFFFF' : '#000000';
    const subText = isDark ? '#B3B3B3' : '#666666';
    const inputBg = isDark ? '#333' : '#f0f0f0';


    useEffect(()=>{
            const user = auth.currentUser;
            if(!user) {
                setLoading(false);
                setPlaylists([]);
                return;
            }

            const q = query(collection(db, "playlists"), where ("userId","==", user.uid));

            const unsub = onSnapshot(q, (snapshot)=> {
                const list = snapshot.docs.map(doc => ({id: doc.id,...doc.data() }));
                setPlaylists(list);

            if(selectedPlaylist){
                const update = list.find(p=>p.id === selectedPlaylist.id);
                if(update) setSelectedPlaylist(update);
            }
            setLoading(false);
            });

            return () => unsub();

    },[selectedPlaylist?.id]);

    const fetchDeezerSongs= async ()=>{
        if (deezerTracks.length > 0) return;
        try{
            const response= await fetch("https://api.deezer.com/chart?&limit=50")
            const resJson = await response.json();
            setDeezerTracks(resJson.tracks.data);

        }catch(e){
            Alert.alert("Error", "Songs not fetched");
            throw e;
        }
    }



    const createNewPlaylist = async ()=>{
        if(!NewPlaylistName.trim()) return;

        if(!auth.currentUser){
            Alert.alert("Authentication Required", "Please log in to create a playlist.");
            return;
        }

        try{
            await createPlaylist(NewPlaylistName);
            setNewPlaylistName("");
            setCreateModalVisible(false);

        }catch(e){
            console.error("cant create playlist", e);
            throw e;
        }
    }  

    
    const SongToPlaylist = async (track)=>{
        try{
            const success = await addSongToPlaylist(selectedPlaylist.id, track);
            if(success){
                Alert.alert("Success","Song added succesfully!");
            }
           
        }catch(e){
            console.error("can't add song to playlits", e);
            throw e;
        }

    }

    const renderPlaylistList = ()=>(
        <View style={{ flex: 1 }}>
            <FlatList
                data={Playlists}
                keyExtractor={(item)=> item.id}
                ListHeaderComponent={<Text style={[styles.headerTitle, { color: text }]}>My Playlists</Text>}
                ListEmptyComponent={
                    !Loading && (
                        <Text style={{ textAlign: 'center', color: subText, marginTop: 50 }}>
                            {auth.currentUser ? "No playlists yet." : "Please log in."}
                        </Text>
                    )
                }
                renderItem={({item})=>  
                <TouchableOpacity style={[styles.playlistCard, { backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5' }]} 
                onPress={() => {
                    setSelectedPlaylist(item);
                    setCurrentView('detail');
                    
                }}>
                <View style={styles.playlistIconPlaceholder}>
                    <IconSymbol  name="play.square.stack.fill" size={30} color={text} />
                </View>
                <View>
                    <Text style={[styles.playlistName, { color: text }]}> {item.name}</Text>
                    <Text style={{ color: subText }}>{ item.songs ? item.songs.length : 0 }</Text>
                </View>

            </TouchableOpacity>}
            />
            <TouchableOpacity style={styles.fab} onPress={()=> setCreateModalVisible(true)}>
                <IconSymbol name="plus" size={30} color="white" />
            </TouchableOpacity>

        </View>
    );


    const renderPlaylistDetail = ()=>(
        <View style={{ flex: 1 }}>
            <View style={styles.navHeader}>
                <TouchableOpacity onPress={()=>setCurrentView('list')} style={{padding: 10}}>
                    <IconSymbol name="chevron.left" size={28} color={text} />
                </TouchableOpacity>
                <Text style={[styles.navTitle, { color: text }]}>{selectedPlaylist?.name} </Text>
                <View style={{width: 28}} />
            </View>
            <FlatList
                data={selectedPlaylist?.songs || []}
                keyExtractor={(item)=>item.id.toString()}
                ListEmptyComponent={<View style={styles.emptyState}>
                        <Text style={{color: subText, textAlign:'center'}}>No songs yet.</Text>
                        <Text style={{color: subText, textAlign:'center'}}>Tap + to add some vibes!</Text>
                    </View>}
                renderItem={({item})=>(
                    <TouchableOpacity 
                        style={styles.songItem}
                        onPress={() => {
                            // Convert playlist song format to match player expectations
                            const track = {
                                id: item.id,
                                title: item.title,
                                artist: { name: item.artist },
                                cover: item.cover,
                                preview: item.preview || null
                            };
                            setCurrentTrack(track);
                            playTrack(track, selectedPlaylist.songs || []); // Play with playlist as queue
                        }}
                    >
                        <Image source={{ uri: item.cover }} style={styles.songImage} />
                        <View style={{flex: 1, marginLeft: 12}}>
                            <Text style={{color: text, fontWeight: '600'}}>{item.title}</Text>
                            <Text style={{color: subText}}>{item.artist}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
            <TouchableOpacity
            style={styles.fab}
            onPress={()=>{
                fetchDeezerSongs();
                setCurrentView('browse');
                }}
            >
                <IconSymbol  name="plus.magnifyingglass" size={30} color="white" />
            </TouchableOpacity>
        </View>
    );


    const renderBrowse = ()=>(
        <View style={{ flex: 1 }}>
            <View>
                <TouchableOpacity onPress={()=> setCurrentView('detail')} style={{padding: 10}}>
                    <IconSymbol  name="chevron.left" size={28} color={text} />
                </TouchableOpacity>
                <Text style={[styles.navTitle, { color: text }]}>Add to "{selectedPlaylist?.name}"</Text>
                <View style={{width: 28}} />
            </View>
            <FlatList
                data={deezerTracks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.songItem}>
                        <TouchableOpacity 
                            style={{flex: 1}}
                            onPress={() => {
                                // Play the selected track
                                const track = {
                                    id: item.id,
                                    title: item.title,
                                    artist: item.artist,
                                    cover: item.album.cover_medium,
                                    preview: item.preview
                                };
                                setCurrentTrack(track);
                                playTrack(track); // Just play this track
                            }}
                        >
                            <Image source={{ uri: item.album.cover_medium }} style={styles.songImage} />
                            <View style={{flex: 1, marginLeft: 12}}>
                                <Text style={{color: text, fontWeight: '600'}} numberOfLines={1}>{item.title}</Text>
                                <Text style={{color: subText}}>{item.artist.name}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => SongToPlaylist(item)} style={{padding: 10}}>
                            <IconSymbol name="plus.circle.fill" size={28} color="#1DB954" />
                        </TouchableOpacity>
                    </View>
                )}

            />
            
        </View>

    );
    return(
    <SafeAreaView style={{flex: 1, backgroundColor: bg}}>
            {currentView === 'list' && renderPlaylistList()}
            {currentView === 'detail' && renderPlaylistDetail()}
            {currentView === 'browse' && renderBrowse()} 
        <Modal
            transparent={true}
            visible={createModalVisible}
            animationType='fade'
            onRequestClose={()=>setCreateModalVisible(false)}>
        
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: isDark ? '#2A2A2A' : 'white' }]}>
                    <Text style={[styles.modalTitle, { color: text }]}>New Playlist</Text>
                    <TextInput style={[styles.input, { backgroundColor: inputBg, color: text }]}
                        placeholder='Playlist Name'
                        placeholderTextColor={subText}
                        value={NewPlaylistName}
                        onChangeText={setNewPlaylistName}
                    />
                    <View style={styles.modalButtons}>
                        <TouchableOpacity onPress={()=> setCreateModalVisible(false)} style={styles.cancelBtn}>
                            <Text style={{color: subText}}> Cancel </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={createNewPlaylist} style={styles.createBtn}>
                            <Text style={{color: 'white', fontWeight: 'bold'}}>Create</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerTitle: { fontSize: 32, fontWeight: 'bold', padding: 20 },
    
    // Playlist List Item
    playlistCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginHorizontal: 20,
        marginBottom: 10,
        borderRadius: 12,
    },
    playlistIconPlaceholder: {
        width: 50, height: 50,
        backgroundColor: 'rgba(128,128,128,0.2)',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15
    },
    playlistName: { fontSize: 18, fontWeight: 'bold' },

    // Detail & Browse Views
    navHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(128,128,128,0.1)'
    },
    navTitle: { fontSize: 20, fontWeight: 'bold' },
    songItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 0.5, borderBottomColor: 'rgba(128,128,128,0.1)' },
    songImage: { width: 50, height: 50, borderRadius: 4 },
    emptyState: { marginTop: 50, alignItems: 'center' },

    // FAB
    fab: {
        position: 'absolute',
        bottom: 30, right: 20,
        backgroundColor: '#1DB954',
        width: 60, height: 60,
        borderRadius: 30,
        justifyContent: 'center', alignItems: 'center',
        elevation: 5, shadowColor: '#000', shadowOffset: {width:0,height:2}, shadowOpacity: 0.3, shadowRadius: 3
    },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '80%', padding: 20, borderRadius: 15, elevation: 5 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
    input: { padding: 12, borderRadius: 8, marginBottom: 20 },
    modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 20 },
    cancelBtn: { padding: 10 },
    createBtn: { backgroundColor: '#1DB954', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 }
});