import Icon from '@expo/vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import themeSpyColors from '../../constants/themeSpyColors';

const SpyGame = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const selectedSet = typeof params.wordSet === 'string' ? params.wordSet : null;
  const [playerCount, setPlayerCount] = useState(3);
  const [questionCount, setQuestionCount] = useState(3);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [showWord, setShowWord] = useState(false);
  const [started, setStarted] = useState(false);
  const [randomizedSetWords, setRandomizedSetWords] = useState<string[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const sets: Record<string, () => Promise<{ default: { words: string[] }; words: string[] }>> = {
    basic_set: () => import("../../idGameSets/basic_set.json"),
  };

  // Helper to load and shuffle set words
  const loadAndShuffleSetWords = async () => {
    let words: string[] = [];
    if (selectedSet) {
      const setLoader = sets[selectedSet];
      if (!setLoader) return [];
      const setData = await setLoader();
      words = setData.words || setData.default?.words || [];
    } else {
      if (Array.isArray(params.wordsCustom)) {
        words = params.wordsCustom as string[];
      } else if (typeof params.wordsCustom === 'string') {
        try {
          words = JSON.parse(params.wordsCustom);
          if (!Array.isArray(words)) {
            words = params.wordsCustom.split(',').map(w => w.trim()).filter(Boolean);
          }
        } catch {
          words = params.wordsCustom.split(',').map(w => w.trim()).filter(Boolean);
        }
      }
    }
    return shuffleArray(words);
  };

  // Reshuffle if not enough questions left

  function shuffleArray(array: string[]): string[] {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  const handleTap = () => {
    if (!started) return;
    if (currentPlayer < playerCount) {
      if (showWord) {
        if (totalCount + questionCount >= randomizedSetWords.length) {
          setTotalCount(0);
          console.log(randomizedSetWords.length);
          console.log(totalCount);
          alert('Set finished! Try a new set maybe????🥺 \n You can still continue playing, reshuffling the current set.');
          (async () => {
            const shuffled = await loadAndShuffleSetWords();
            setRandomizedSetWords(shuffled);
          })();
        } else {
          setTotalCount(totalCount + questionCount);
          setCurrentPlayer(currentPlayer + 1);
          setShowWord(false);
          setWordIndex((wordIndex + questionCount) % randomizedSetWords.length);
        }
      }
    } else {
      setCurrentPlayer(1);
      setShowWord(false);
      setStarted(false);
    }
  };

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.backIcon} onPress={() => started ? router.push('/id/spy') : router.push('/id/spy_game_select')}>
          <Icon name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
      {!started ? (
        <>
          <View style = {styles.pickerLabelContainer}>
            <View style={styles.labelsContainer}>
              <Text style={styles.label}>Players</Text>
              <Text style={styles.label}>Questions</Text>
            </View>
            <View style={styles.pickerContainer}>
              <Picker
                itemStyle={{color: '#ffffff'}}
                selectedValue={playerCount}
                style={styles.picker}
                onValueChange={setPlayerCount}
              >
                {[...Array(10)].map((_, i) => (
                  <Picker.Item key={i+3} label={`${i+3}`} value={i+3} />
                ))}
              </Picker>
              <Picker
                itemStyle={{color: '#ffffff'}}
                selectedValue={questionCount}
                style={styles.picker}
                onValueChange={setQuestionCount}
              >
                {[...Array(6)].map((_, i) => (
                  <Picker.Item key={i+3} label={`${i+3}`} value={i+3} />
                ))}
              </Picker>
            </View>
          </View>
          <TouchableOpacity
            style={styles.startButton}
            onPress={async () =>  {
              setStarted(true);
              const shuffled = await loadAndShuffleSetWords();
              setRandomizedSetWords(shuffled);
              setWordIndex(0);
              setShowWord(true);
            }}
          >
            <Text style={styles.startButtonText}>Start Game</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.gameArea} onPress={() => {
          handleTap();
          setShowWord(true);
        }}>
          <Text style={styles.playerText}>Player {currentPlayer}</Text>
          
          {showWord ? (
            <View>
              {randomizedSetWords.slice(wordIndex, wordIndex + questionCount).map((w, idx) => (
                <Text key={idx} style={styles.wordText}>{`${idx + 1}. ${w}`}</Text>
              ))}
            </View>
          ) : null}
          <Text style={styles.tapText}>Tap to continue</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themeSpyColors.background,
    padding: RFValue(16),
  },
  backIcon: {
    position: 'absolute',
    top: RFValue(40),
    left: RFValue(20),
    zIndex: 10,
  },
  label: {
    fontSize: RFValue(16),
    marginBottom: RFValue(8),
    fontWeight: 'bold',
    textAlign: "center",
    color: themeSpyColors.text,
  },
  picker: {
    width: RFValue(80),
    marginBottom: RFValue(16),
    color: themeSpyColors.text,
    fontSize: RFValue(20),
  },
  input: {
    width: RFValue(180),
    height: RFValue(40),
    borderColor: themeSpyColors.border,
    borderWidth: RFValue(1),
    borderRadius: RFValue(8),
    paddingHorizontal: RFValue(8),
    marginBottom: RFValue(16),
    fontSize: RFValue(16),
    backgroundColor: themeSpyColors.inputBackground,
  },
  startButton: {
    backgroundColor: themeSpyColors.startButton,
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(24),
    borderRadius: RFValue(8),
    marginTop: RFValue(8),
  },
  startButtonText: {
    color: themeSpyColors.text,
    fontWeight: 'bold',
    fontSize: RFValue(16),
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  playerText: {
    fontSize: RFValue(24),
    fontWeight: 'bold',
    marginBottom: RFValue(16),
    color: themeSpyColors.text,
  },
  wordText: {
    fontSize: RFValue(16),
    color: themeSpyColors.wordText,
    fontWeight: 'bold',
    marginBottom: RFValue(24),
  },
  tapText: {
    fontSize: RFValue(14),
    color: themeSpyColors.tapText,
    marginTop: RFValue(32),
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '70%',
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '70%',
  },
  pickerLabelContainer: {
    marginTop: RFValue(20),
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  }
});

export default SpyGame;
