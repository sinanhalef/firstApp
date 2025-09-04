import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import themeSpyColors from '../constants/themeSpyColors';


const SpyGameSelect = () => {
	const router = useRouter();
	const wordSets = [
		{ title: 'Places', file: 'places' },
		{ title: 'Famous People  🇺🇸', file: 'famous_people_us' },
        { title: 'Famous People  🇹🇷', file: 'famous_people_tr' },
        { title: 'Football Players  🌍', file: 'football_players_world' },
        { title: 'Football Players  🇹🇷', file: 'football_players_tr' },
        { title: 'Films  🎬', file: 'films_world' },
    
	];
	const [selectedSet, setSelectedSet] = useState<string | null>(null);

	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.backIcon} onPress={() => router.push('/my_games')}>
				<Ionicons name="arrow-back" size={28} color="#fff" />
			</TouchableOpacity>
			<Text style={styles.title}>Select a Game Set</Text>
			<TouchableOpacity
				style={[styles.setButton, styles.createButton]}
				onPress={() => { router.push('/spy_my_sets'); }}
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
				<>
					<TouchableOpacity
						style={[styles.setButton, styles.playButton]}
						onPress={() => router.push({ pathname: '/spy', params: { wordSet: selectedSet } })}
					>
						<Text style={styles.setText}>Play</Text>
					</TouchableOpacity>
				</>
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

