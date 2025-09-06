import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import themeSpyColors from '../../constants/themeSpyColors';

const SpyGameSelect = () => {
	const router = useRouter();
	const wordSets = [
		{ title: 'Basic Set', file: 'basic_set' },
		{ title: 'Second Set', file: 'second_set' },
	];

	const sets: Record<string, () => Promise<{ default: { words: string[] }; words: string[] }>> = {
    basic_set: () => import("../../idGameSets/basic_set.json"),
	second_set: () => import("../../idGameSets/second_set.json"),

};

	const [selectedSet, setSelectedSet] = useState<string | null>(null);
	//const [index, setIndex] = useState(1);

	// playin sagına bir edit tuşu ekle, o da spy_create_your_own a gitsin, orada da düzenleme yapabilsin
	const saveSetWithName = async (saveName: string) => {
		try {
			function ensureJsonExtension(string: string) {
				return string.endsWith('.json') ? string : string + '.json';
			}
			const fs = require('expo-file-system');
			const finalName = ensureJsonExtension(saveName);
			const path = fs.documentDirectory + "id/" + finalName;
			const words = await loadAndShuffleSetWords();
			console.log("Saving words:", words);
			await fs.writeAsStringAsync(path, JSON.stringify({ words }), { encoding: fs.EncodingType.UTF8 });
		} catch (e) {
			alert('Failed to save set.');
		}
	};

	

	const loadAndShuffleSetWords = async () => {
    let words: string[] = [];
	console.log("Loading words for set:", selectedSet);
    if (!selectedSet) {
      const setLoader = sets["basic_set"];
      if (!setLoader) return [];
      const setData = await setLoader();
      words = setData.words || setData.default?.words || [];
    } 
    return words;
  };

	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.backIcon} onPress={() => router.push('/my_games')}>
				<Ionicons name="arrow-back" size={28} color="#fff" />
			</TouchableOpacity>
			<Text style={styles.title}>Select a Game Set</Text>
			<TouchableOpacity
				style={[styles.setButton, styles.createButton]}
				onPress={() => { router.push('/id/spy_my_sets'); }}
			>
				<Text style={styles.createButtonText}>My Own Sets</Text>
			</TouchableOpacity>
			<FlatList
				data={wordSets}
				keyExtractor={item => item.file}
				renderItem={({ item }) => {
					const isSelected = selectedSet === item.file;
					return (
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<TouchableOpacity
								style={[styles.setButton, isSelected && styles.setButtonDisabled]}
								onPress={() => setSelectedSet(item.file)}
								disabled={isSelected}
							>
								<Text style={styles.setText}>{item.title}</Text>
							</TouchableOpacity>
						</View>
					);
				}}
			/>
			{selectedSet && (
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<TouchableOpacity
						style={[styles.playAndEditButton, styles.playButton]}
						onPress={() => router.push({ pathname: '/id/spy', params: { wordSet: selectedSet } })}
					>
						<Text style={styles.setText}>Play</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.playAndEditButton]}
								onPress={async () => {
									//await saveSetWithName(selectedSet);
									const setLoader = sets[selectedSet];
									if (!setLoader) return [];
									const setData = await setLoader();
									//const words = setData.words.split(',').map(w => w.trim()).filter(Boolean);
									router.push({
										pathname: '/id/spy_create_your_own',
										params: {
											wordsCustom: JSON.stringify(setData.words).replace("[", "").replace("]","").replaceAll("\"",""),
											wordSet: "My " + selectedSet,
											//TODO: add cleaning here
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
}
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
});

export default SpyGameSelect;

