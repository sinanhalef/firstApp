import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import themeSpyColors from '../../constants/themeSpyColors';
import { db, ref, update } from './firebase';

// This is a copy of the pass-and-play landing page for the multiplayer version
const SpyMultiplayerGameSelect = () => {
  const router = useRouter();
  const { roomCode } = useLocalSearchParams();
  const wordSets = [
    { title: 'Places', file: 'places' },
    { title: 'Famous People  🇺🇸', file: 'famous_people_us' },
    { title: 'Famous People  🇹🇷', file: 'famous_people_tr' },
    { title: 'Football Players  🌍', file: 'football_players_world' },
    { title: 'Football Players  🇹🇷', file: 'football_players_tr' },
    { title: 'Films  🎬', file: 'films_world' },
  ];
  const sets = {
    places: () => import('../../wordSets/places.json'),
    famous_people_us: () => import('../../wordSets/famous_people_us.json'),
    famous_people_tr: () => import('../../wordSets/famous_people_tr.json'),
    football_players_tr: () => import('../../wordSets/football_players_tr.json'),
    football_players_world: () => import('../../wordSets/football_players_world.json'),
    films_world: () => import('../../wordSets/films_world.json'),
  };
  const [selectedSet, setSelectedSet] = useState(null);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backIcon} onPress={() => router.push('/my_games')}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>Select a Game Set</Text>
      <TouchableOpacity
        style={[styles.setButton, styles.createButton]}
        onPress={() => { router.push('/spy/spy_my_sets'); }}
      >
        <Text style={styles.createButtonText}>My Own Sets</Text>
      </TouchableOpacity>
      <FlatList
        data={wordSets}
        keyExtractor={item => item.file}
        renderItem={({ item }) => {
          const isSelected = selectedSet === item.file;
          return (
            <TouchableOpacity
              style={[styles.setButton, isSelected && styles.setButtonDisabled]}
              onPress={() => setSelectedSet(item.file)}
              disabled={isSelected}
            >
              <Text style={styles.setText}>{item.title}</Text>
            </TouchableOpacity>
          );
        }}
      />
      {selectedSet && (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={[styles.playAndEditButton, styles.playButton]}
            onPress={async () => {
              if (!roomCode || !selectedSet) return;
              // Persist selected set in the room (duplicate under selectedSet* for wider client compatibility)
              const chosen = wordSets.find(w => w.file === selectedSet);
              const wordSetTitle = chosen?.title || String(selectedSet);
              await update(ref(db, `rooms/${roomCode}`), {
                wordSet: String(selectedSet),
                wordSetTitle,
                selectedSetKey: String(selectedSet),
                selectedSetTitle: wordSetTitle,
              });
              // Also store under a public node for clients that only watch public
              await update(ref(db, `rooms/${roomCode}/public`), {
                selectedSetKey: String(selectedSet),
                selectedSetTitle: wordSetTitle,
              });
              router.push({ pathname: '/spy_multiplayer/room_waiting', params: { roomCode } });
            }}
          >
            <Text style={styles.setText}>Play</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.playAndEditButton]}
            onPress={async () => {
              const setLoader = sets[selectedSet];
              if (!setLoader) return [];
              const setData = await setLoader();
              router.push({
                pathname: '/spy/spy_create_your_own',
                params: {
                  wordsCustom: JSON.stringify(setData.words).replace('[', '').replace(']', '').replaceAll('"', ''),
                  wordSet: 'My ' + selectedSet,
                },
              });
            }}
          >
            <Ionicons name="create" size={RFValue(24)} color={themeSpyColors.playButton} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  createButton: {
    backgroundColor: themeSpyColors.createYourOwnSetButton || '#ff9800',
    marginBottom: RFValue(16),
  },
  createButtonText: {
    color: themeSpyColors.text,
    fontSize: RFValue(18),
    fontWeight: 'bold',
  },
  setButtonDisabled: {
    backgroundColor: themeSpyColors.disabledButton || '#888',
  },
  backIcon: {
    position: 'absolute',
    top: RFValue(40),
    left: RFValue(20),
    zIndex: 10,
  },
  playButton: {
    backgroundColor: themeSpyColors.playButton,
    marginTop: RFValue(16),
  },
  container: {
    flex: 1,
    backgroundColor: themeSpyColors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: RFValue(16),
  },
  title: {
    fontSize: RFValue(24),
    color: themeSpyColors.text,
    fontWeight: 'bold',
    marginBottom: RFValue(24),
    marginTop: RFValue(50),
  },
  setButton: {
    backgroundColor: themeSpyColors.button,
    padding: RFValue(12),
    borderRadius: RFValue(8),
    marginBottom: RFValue(12),
    width: RFValue(200),
    alignItems: 'center',
  },
  setText: {
    color: themeSpyColors.text,
    fontSize: RFValue(18),
    fontWeight: 'bold',
  },
  selectedText: {
    color: themeSpyColors.selectedText,
    fontSize: RFValue(16),
    marginTop: RFValue(24),
  },
  playAndEditButton: {
    backgroundColor: themeSpyColors.button,
    padding: RFValue(12),
    borderRadius: RFValue(8),
    marginBottom: RFValue(30),
    marginRight: RFValue(10),
    marginLeft: RFValue(10),
    width: RFValue(100),
    alignItems: 'center',
    marginTop: RFValue(16),
  },
});

export default SpyMultiplayerGameSelect;
