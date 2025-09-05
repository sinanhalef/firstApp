import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import themeSpyColors from '../../constants/themeSpyColors';
import { useLocalSearchParams , useRouter } from 'expo-router';

const SpyMySets = () => {
  const [sets, setSets] = useState([]);
  const router = useRouter();
  const params = useLocalSearchParams();

  const deleteSet = async (filename) => {
    try {
      await FileSystem.deleteAsync(FileSystem.documentDirectory + filename);
      setSets(sets.filter(set => set !== filename));
    } catch (e) {
      alert('Failed to delete set.');
    }
  };

  useEffect(() => {
    const loadSets = async () => {
      const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
      const jsonSets = files.filter(f => f.endsWith('.json'));
      setSets(jsonSets);
    };
    loadSets();
  }, []);

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.backIcon} onPress={() => router.push('/spy/spy_game_select')}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
      <Text style={styles.title}>Your Saved Sets</Text>
        <View style={styles.setRow}>
      <TouchableOpacity
                    style={[styles.setButton, { backgroundColor: themeSpyColors.createYourOwnSetButton }, styles.createButton]}
                    onPress={() => { router.push({ pathname: '/spy/spy_create_your_own', params: { wordSet: "" } }); }}
                >
                    <Text style={styles.setText}>Create New!</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.trashButton}>
              <Ionicons name="trash" size={RFValue(24)} color=  "black" />
              </TouchableOpacity>
            </View>

      <FlatList
        data={sets}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <View style={styles.setRow}>
            <TouchableOpacity style={styles.setButton}
            onPress={() => { router.push({ pathname: '/spy/spy_create_your_own', params: { wordSet: item } }); }}>
              <Text style={styles.setText}>{item.replace('.json', '')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteSet(item)} style={styles.trashButton}>
              <Ionicons name="trash" size={RFValue(24)} color={themeSpyColors.spyText} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No saved sets found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    backIcon: {
		position: 'absolute',
		top: RFValue(40),
		left: RFValue(20),
		zIndex: 10,
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
  emptyText: {
    color: themeSpyColors.tapText,
    fontSize: RFValue(16),
    marginTop: RFValue(32),
    textAlign: 'center',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: RFValue(12),
  },
  trashButton: {
    marginLeft: RFValue(8),
  },
});

export default SpyMySets;
