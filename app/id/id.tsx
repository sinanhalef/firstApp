import Icon from '@expo/vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import themeSpyColors from '../../constants/themeSpyColors';

const IdGame = () => {
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
  const [history, setHistory] = useState<number[]>([0]); // track starting indices for back navigation
  // totalCount removed; we manage progression via wordIndex only

  const sets: Record<string, () => Promise<{ default: { words: string[] }; words: string[] }>> = {
    basic_set: () => import("../../idGameSets/basic_set.json"),
    second_set: () =>  import("../../idGameSets/second_set.json"),
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

    // Phase 1: reveal current batch (between rounds state)
    if (!showWord) {
      setShowWord(true);
      return;
    }

    // Phase 2: hide & advance to next round
    const lastRound = currentPlayer >= playerCount;
    if (lastRound) {
      setStarted(false);
      setCurrentPlayer(1);
      setShowWord(false);
      setHistory([0]);
      setWordIndex(0);
      return;
    }

    // Compute next index / reshuffle if needed
    let nextIndex = wordIndex + questionCount;
    setRandomizedSetWords(prev => {
      if (prev.length === 0) return prev;
      if (nextIndex + questionCount - 1 >= prev.length) {
        const reshuffled = shuffleArray(prev);
        nextIndex = 0;
        setWordIndex(0);
        setHistory([0]);
        return reshuffled;
      } else {
        setWordIndex(nextIndex);
        setHistory(h => [...h, nextIndex]);
        return prev;
      }
    });

    setCurrentPlayer(p => p + 1);
    setShowWord(false); // move to between-round state for next player
  };

  const handleBackOneRound = () => {
    if (!started) return;
    if (showWord) return;
    setHistory(h => {
      if (h.length <= 1) return h; // nothing to go back to
      const newHist = h.slice(0, -1);
      const prevStart = newHist[newHist.length - 1];
      setWordIndex(prevStart);
      setCurrentPlayer(p => Math.max(1, p - 1));
      setShowWord(true); // reveal previous batch immediately
      return newHist;
    });
  };

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.backIcon} onPress={() => started ? router.push({pathname: '/id/id', params: {wordSet: params.wordSet} }) : router.push('/id/id_game_select')}>
          <Icon name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
      {!started ? (
        <>
          <View style = {styles.pickerLabelContainer}>
            <View style={styles.labelsContainer}>
              <Text style={styles.label}>Rounds</Text>
              <Text style={styles.label}>Questions</Text>
            </View>
            <View style={styles.pickerContainer}>
              <Picker
                itemStyle={{color: '#ffffff'}}
                selectedValue={playerCount}
                style={styles.picker}
                onValueChange={setPlayerCount}
              >
                {[...Array(20)].map((_, i) => (
                  <Picker.Item key={i+1} label={`${i+1}`} value={i+1} />
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
              setHistory([0]);
              setShowWord(false); // start in hidden state: first tap reveals
            }}
          >
            <Text style={styles.startButtonText}>Start Game</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.gameArea} onPress={() => {
          handleTap();
        }}>
          <Text style={styles.playerText}>Round {currentPlayer}</Text>

          {currentPlayer > 1 && !showWord &&
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                          style={styles.playAndEditButton}
                          onPress={handleBackOneRound}
                        >
                          <Text style = {styles.backText}>Back</Text>
              </TouchableOpacity>
              </View>
          }
          
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
  backText: {
    fontSize: RFValue(16),
    color: themeSpyColors.wordText,
    fontWeight: 'bold',
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
});

export default IdGame;
