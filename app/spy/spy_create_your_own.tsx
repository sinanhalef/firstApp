import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import themeSpyColors from '../../constants/themeSpyColors';

const SpyCreateYourOwn = () => {
    const router = useRouter();
	const [word, setWord] = useState('');
	const [words, setWords] = useState<string[]>([]);
	const [editIndex, setEditIndex] = useState<number | null>(null);
	const [editText, setEditText] = useState('');
	const [saveName, setSaveName] = useState('');
	const [saving, setSaving] = useState(false);
    const params = useLocalSearchParams();

	React.useEffect(() => {
		
		//FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'spy_sets').catch(() => { });
		const loadWords = async () => {
			try {
				const path = FileSystem.documentDirectory + "spy/" + params.wordSet;
				const exists = await FileSystem.getInfoAsync(path);
				if (exists.exists) {
					const fileContent = await FileSystem.readAsStringAsync(path);
					const json = JSON.parse(fileContent);
					if (Array.isArray(json.words)) {
						setWords(json.words);
					}
				}
			} catch (e) {
			}
		};
		if (params.wordSet) {
		loadWords();
	}  if (params.wordsCustom && typeof params.wordsCustom ==='string') {
		console.log(params.wordsCustom.length);
		const words = params.wordsCustom.split(',').map(w => w.trim()).filter(Boolean);
		if (Array.isArray(words)) {
			setWords(words);
		}
	}
	}, []);

	const addWord = () => {
		if (word.trim() && !words.includes(word.trim())) {
			setWords([...words, word.trim()]);
			setWord('');
		}
	};

    const saveSetAndPlay = async () => {
        if (words.length === 0) return;
        try {
            saveSetWithName();
            router.push({ pathname: '/spy/spy', params: { wordsCustom: words } });
        } catch (e) {
            alert('Failed to save set.');
        }
    };

	const deleteWord = (index: number) => {
		setWords(words.filter((_, i) => i !== index));
		if (editIndex === index) {
			setEditIndex(null);
			setEditText('');
		}
	};

	const startEditWord = (index: number) => {
		setEditIndex(index);
		setEditText(words[index]);
	};

	const saveEditWord = () => {
		if (editIndex !== null && editText.trim()) {
			const updated = [...words];
			updated[editIndex] = editText.trim();
			setWords(updated);
			setEditIndex(null);
			setEditText('');
		}
	};

	const saveSetWithName = async () => {
		setSaving(true);
		try {
			function ensureJsonExtension(string: string) {
				return string.endsWith('.json') ? string : string + '.json';
			}
			const fs = require('expo-file-system');
			const nameToSave = (saveName === "" || saveName.trim() === "" || saveName === null)
				? (params.wordSet as string)
				: saveName.trim();
			const finalName = ensureJsonExtension(nameToSave);
			const path = fs.documentDirectory + "spy/" + finalName;
			await fs.writeAsStringAsync(path, JSON.stringify({ words }), { encoding: fs.EncodingType.UTF8 });
			setSaveName('');
		} catch (e) {
			alert('Failed to save set.');
		}
		setSaving(false);
	};

		return (
				<View style={styles.container}>
					<TouchableOpacity style={styles.backIcon} onPress={() => router.push('/spy/spy_my_sets')}>
						<Ionicons name="arrow-back" size={28} color="#fff" />
					</TouchableOpacity>
					<Text style={styles.title}>Add Your Own Words!</Text>
					<View style={styles.inputRow}>
						<TextInput
							style={styles.input}
							value={word}
							onChangeText={setWord}
							placeholder="Enter a word"
							placeholderTextColor={themeSpyColors.tapText}
						/>
						<TouchableOpacity style={styles.addButton} onPress={addWord}>
							<Ionicons name="add-circle" size={RFValue(32)} color={themeSpyColors.playButton} />
						</TouchableOpacity>
					</View>
					<View style={styles.scrollContainer}>
						<FlatList
							data={words}
							keyExtractor={(item, idx) => item + idx}
							renderItem={({ item, index }) => (
								<View style={styles.wordRow}>
									{editIndex === index ? (
										<>
											<TextInput
												style={styles.editInput}
												value={editText}
												onChangeText={setEditText}
												autoFocus
											/>
											<TouchableOpacity onPress={saveEditWord}>
												<Ionicons name="checkmark-circle" size={RFValue(24)} color={themeSpyColors.playButton} />
											</TouchableOpacity>
										</>
									) : (
										<>
											<Text style={styles.wordText}>{item}</Text>
											<TouchableOpacity onPress={() => startEditWord(index)}>
												<Ionicons name="create" size={RFValue(24)} color={themeSpyColors.playButton} />
											</TouchableOpacity>
											<TouchableOpacity onPress={() => deleteWord(index)}>
												<Ionicons name="trash" size={RFValue(24)} color={themeSpyColors.spyText} />
											</TouchableOpacity>
										</>
									)}
								</View>
							)}
							ListEmptyComponent={<Text style={styles.emptyText}>No words added yet.</Text>}
							showsVerticalScrollIndicator={false}
						/>
						<LinearGradient
							colors={["transparent", themeSpyColors.background]}
							style={styles.gradient}
							pointerEvents="none"
						/>
                    
					</View>
                    <TouchableOpacity
                            style={[styles.playButton]}
                            onPress={saveSetAndPlay}
                            disabled={words.length === 0}
                        >
                            <Text style={styles.playButtonText}>Play</Text>
                        </TouchableOpacity>
						<View style={styles.saveRow}>
							<TextInput
								style={styles.saveInput}
								value={saveName}
								onChangeText={setSaveName}
								placeholder={'Enter set name'}
								placeholderTextColor={themeSpyColors.tapText}
                                
							/>
							<TouchableOpacity
								style={styles.saveButton}
								onPress={saveSetWithName}
								disabled={saving || words.length === 0}
							>
								<Text style={styles.saveButtonText}>Save</Text>
							</TouchableOpacity>
						</View>
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
	gradient: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		height: RFValue(16),
		borderBottomLeftRadius: RFValue(8),
		borderBottomRightRadius: RFValue(8),
	},
	scrollContainer: {
		maxHeight: RFValue(330),
		width: '100%',
		marginBottom: RFValue(16),
	},
	container: {
		flex: 1,
		backgroundColor: themeSpyColors.background,
		padding: RFValue(16),
		alignItems: 'center',
	},
	title: {
		fontSize: RFValue(24),
		color: themeSpyColors.text,
		fontWeight: 'bold',
		marginBottom: RFValue(24),
		marginTop: RFValue(50),
	},
	inputRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: RFValue(16),
	},
	input: {
		backgroundColor: themeSpyColors.inputBackground,
		borderColor: themeSpyColors.border,
		borderWidth: RFValue(1),
		borderRadius: RFValue(8),
		paddingHorizontal: RFValue(8),
		fontSize: RFValue(16),
		width: RFValue(180),
		height: RFValue(40),
		color: "ffffff",
	},
	addButton: {
		marginLeft: RFValue(8),
	},
	wordRow: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: themeSpyColors.button,
		borderRadius: RFValue(8),
		padding: RFValue(8),
		marginBottom: RFValue(8),
		minWidth: RFValue(200),
	},
	wordText: {
		color: themeSpyColors.text,
		fontSize: RFValue(18),
		flex: 1,
		fontWeight: 'bold',
	},
	editInput: {
		backgroundColor: themeSpyColors.inputBackground,
		borderColor: themeSpyColors.border,
		borderWidth: RFValue(1),
		borderRadius: RFValue(8),
		paddingHorizontal: RFValue(8),
		fontSize: RFValue(16),
		width: RFValue(120),
		height: RFValue(32),
		color: "ffffff",
		marginRight: RFValue(8),
	},
	emptyText: {
		color: themeSpyColors.tapText,
		fontSize: RFValue(16),
		marginTop: RFValue(32),
		textAlign: 'center',
	},
    playButton: {
        position: 'absolute',
        bottom: RFValue(50),
    
		backgroundColor: themeSpyColors.playButton,
        marginTop: RFValue(16),
		alignItems: 'center',
        justifyContent: 'center',
        minHeight: RFValue(40),
        width: '80%',
        borderRadius: RFValue(8),
	},
	playButtonText: {
		color: themeSpyColors.text,
		fontSize: RFValue(18),
		fontWeight: 'bold',
		textAlign: 'center',
	},
	saveRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: RFValue(8),
		marginBottom: RFValue(8),
	},
	saveInput: {
		backgroundColor: themeSpyColors.inputBackground,
		borderColor: themeSpyColors.border,
		borderWidth: RFValue(1),
		borderRadius: RFValue(8),
		paddingHorizontal: RFValue(8),
		fontSize: RFValue(16),
		width: RFValue(140),
		height: RFValue(40),
		color: "ffffff",
		marginRight: RFValue(8),
	},
	saveButton: {
		backgroundColor: themeSpyColors.playButton,
		borderRadius: RFValue(8),
		paddingHorizontal: RFValue(16),
		paddingVertical: RFValue(8),
	},
	saveButtonText: {
		color: themeSpyColors.text,
		fontSize: RFValue(16),
		fontWeight: 'bold',
	},
   
});

export default SpyCreateYourOwn;

