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
  const [spyCount, setSpyCount] = useState(1);
  const [word, setWord] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [showWord, setShowWord] = useState(false);
  const [started, setStarted] = useState(false);
  const [rememberWord, setRememberWord] = useState('');
  const [spies, setSpies] = useState([0,1,2]);
  const [spyStyle, setSpyStyle] = useState(false);
  const [randomizedSetWords, setRandomizedSetWords] = useState<string[]>([]);
  const [wordIndex, setWordIndex] = useState(0);

  const sets: Record<string, () => Promise<{ default: { words: string[] }; words: string[] }>> = {
    places: () => import("../../wordSets/places.json"),
    famous_people_us: () => import("../../wordSets/famous_people_us.json"),
    famous_people_tr: () => import("../../wordSets/famous_people_tr.json"),
    football_players_tr: () => import("../../wordSets/football_players_tr.json"),
    football_players_world: () => import("../../wordSets/football_players_world.json"),
    films_world: () => import("../../wordSets/films_world.json"),
  };


  const handleTap = () => {
    if (!started) return;
    if (!showWord) {
      if (spies.includes(currentPlayer-1)) {
            setWord("You are a spy!!");
            setSpyStyle(true);
        } else {
            setWord(rememberWord);
            setSpyStyle(false);
        }
      setShowWord(true);
    } else {
      if (currentPlayer < playerCount) {
        setCurrentPlayer(currentPlayer + 1);
        setShowWord(false);
      } else {
        setCurrentPlayer(1);
        setShowWord(false);
        setStarted(false);
      }
    }
  };

  const selectRandomSpies = () => {
    const allPlayers = Array.from({ length: playerCount }, (_, i) => i);
    const shuffled = allPlayers.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, spyCount);
    setSpies(selected);
  };

  function shuffleArray(array: string[]): string[] {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  const selectRandomWord = async () => {
    let words: string[] = [];
    if (selectedSet) {
      const setLoader = sets[selectedSet];
      if (!setLoader) return '';
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

    if (randomizedSetWords.length === 0 || randomizedSetWords.length !== words.length || wordIndex+1 === words.length) {
      const shuffled = shuffleArray(words);
      setRandomizedSetWords(shuffled);
      setWordIndex(0);
      setRememberWord(shuffled[0]);
      return shuffled[0];
    } else {
      const nextIndex = (wordIndex + 1) % randomizedSetWords.length;
      setWordIndex(nextIndex);
      setRememberWord(randomizedSetWords[nextIndex]);
      return randomizedSetWords[nextIndex];
    }
  }

  
  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.backIcon} onPress={() => started ? router.push('/spy/spy') : router.push('/spy/spy_game_select')}>
          <Icon name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
      {!started ? (
        <>
          
          <View style = {styles.pickerLabelContainer}>

          <View style={styles.labelsContainer}>
          <Text style={styles.label}>Players</Text>
          <Text style={styles.label}>Spies</Text>
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
            selectedValue={spyCount}
            style={styles.picker}
            onValueChange={setSpyCount}
          >
            {[...Array(3)].map((_, i) => (
              <Picker.Item key={i+1} label={`${i+1}`} value={i+1} />
            ))}
          </Picker>
          </View>
          </View>
        
          <TouchableOpacity
            style={styles.startButton}
            onPress={async () =>  {setStarted(true); selectRandomSpies(); setWord(await selectRandomWord());}}
          >
            <Text style={styles.startButtonText}>Start Game</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.gameArea} onPress={handleTap}>
          <Text style={styles.playerText}>Player {currentPlayer}</Text>
          {showWord ? <Text style={spyStyle ? styles.spyText : styles.wordText}>{word}</Text> : null}
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
    fontSize: RFValue(32),
    color: themeSpyColors.wordText,
    fontWeight: 'bold',
    marginBottom: RFValue(24),
  },
  spyText: {
    fontSize: RFValue(32),
    color: themeSpyColors.spyText,
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
