import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';
import themeSpyColors from '../constants/themeSpyColors';
import { RFValue } from 'react-native-responsive-fontsize';
import { useRouter } from 'expo-router';

const SpyMySets = () => {
  const [sets, setSets] = useState([]);
  const router = useRouter();

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
      <Text style={styles.title}>Your Saved Sets</Text>
      <TouchableOpacity
                    style={[styles.setButton, { backgroundColor: themeSpyColors.createYourOwnSetButton }, styles.createButton]}
                    onPress={() => { router.push('/spy_create_your_own'); }}
                >
                    <Text style={styles.setText}>Create New!</Text>
                </TouchableOpacity>
      <FlatList
        data={sets}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.setButton}>
            <Text style={styles.setText}>{item.replace('.json', '')}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No saved sets found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default SpyMySets;
