import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Icon from '@expo/vector-icons/Ionicons';

const SpyGame = () => {
  const router = useRouter();
  const [playerCount, setPlayerCount] = useState(3);
  const [spyCount, setSpyCount] = useState(1);
  const [word, setWord] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [showWord, setShowWord] = useState(false);
  const [started, setStarted] = useState(false);
  const [rememberWord, setRememberWord] = useState('');
  const [spies, setSpies] = useState([0,1,2]);
  const [spyStyle, setSpyStyle] = useState(false);

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
    console.log(selected);
  };
  
  const selectRandomWord = () => {
    const places = require('../wordSets/places.json').places;
    const randomIndex = Math.floor(Math.random() * places.length);
    setRememberWord(places[randomIndex]);
    return places[randomIndex];
  }

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.backIcon} onPress={() => router.push('/my_games')}>
          <Icon name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
      {!started ? (
        <>
        {/* <Text style={styles.label}>Type in a word:</Text> */}
          {/* <TextInput
            style={styles.input}
            value={word}
            onChangeText={() => {}}
            placeholder="Enter word"
          /> */}
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
            onPress={() =>  {setStarted(true); selectRandomSpies(); setWord(selectRandomWord());}}
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
    backgroundColor: 'rgba(0, 0, 0, 1)',
    padding: RFValue(16),
  },
  backIcon: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  label: {
    fontSize: RFValue(16),
    marginBottom: 8,
    fontWeight: 'bold',
    textAlign: "center",
      color: '#ffffff',
  },
  picker: {
    width: RFValue(80),
    marginBottom: RFValue(16),
    color: '#ffffff',
    fontSize: RFValue(20),
  },
  input: {
    width: RFValue(180),
    height: RFValue(40),
    borderColor: '#ccc',
    borderWidth: RFValue(1),
    borderRadius: RFValue(8),
    paddingHorizontal: RFValue(8),
    marginBottom: RFValue(16),
    fontSize: RFValue(16),
    backgroundColor: '#f9f9f9',
  },
  startButton: {
    backgroundColor: '#961a1aff',
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(24),
    borderRadius: RFValue(8),
    marginTop: RFValue(8),
  },
  startButtonText: {
    color: '#fff',
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
    color: '#ffffff',
  },
  wordText: {
    fontSize: RFValue(32),
    color: '#1fa4cd',
    fontWeight: 'bold',
    marginBottom: 24,
  },
  spyText: {
    fontSize: RFValue(32),
    color: '#ff0000ff',
    fontWeight: 'bold',
    marginBottom: 24,
  },
  tapText: {
    fontSize: RFValue(14),
    color: '#888',
    marginTop: 32,
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
