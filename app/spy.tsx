import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const SpyGame = () => {
  const [playerCount, setPlayerCount] = useState(3);
  const [spyCount, setSpyCount] = useState(1);
  const [word, setWord] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [showWord, setShowWord] = useState(false);
  const [started, setStarted] = useState(false);
  const [rememberWord, setRememberWord] = useState('');
  const [spies, setSpies] = useState([0,1,2]);

  const handleTap = () => {
    if (!started) return;
    if (!showWord) {
      setShowWord(true);
    } else {
      if (currentPlayer < playerCount) {
        setCurrentPlayer(currentPlayer + 1);
        if (spies.includes(currentPlayer)) {
            setWord("You are a spy!!");
        } else {
            setWord(rememberWord);
        }
        setShowWord(false);
      } else {
        setCurrentPlayer(1);
        setShowWord(false);
        setStarted(false);
      }
    }
  };

  const selectRandomSpies = () => {
    setRememberWord(word);
    const allPlayers = Array.from({ length: playerCount }, (_, i) => i);
    const shuffled = allPlayers.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, spyCount);
    console.log("Selected spies:", selected);
    setSpies(selected);
  };

  return (
    <View style={styles.container}>
      {!started ? (
        <>
        <Text style={styles.label}>Type in a word:</Text>
          <TextInput
            style={styles.input}
            value={word}
            onChangeText={setWord}
            placeholder="Enter word"
          />
          <Text style={styles.label}>Select number of players:</Text>
          <Picker
            selectedValue={playerCount}
            style={styles.picker}
            onValueChange={setPlayerCount}
          >
            {[...Array(10)].map((_, i) => (
              <Picker.Item key={i+3} label={`${i+3}`} value={i+3} />
            ))}
          </Picker>
          <Text style={styles.label}>Select number of spies:</Text>
          <Picker
            selectedValue={spyCount}
            style={styles.picker}
            onValueChange={setSpyCount}
          >
            {[...Array(3)].map((_, i) => (
              <Picker.Item key={i+1} label={`${i+1}`} value={i+1} />
            ))}
          </Picker>
        
          <TouchableOpacity
            style={styles.startButton}
            onPress={() =>  {setStarted(true); selectRandomSpies();}}
            disabled={!word}
          >
            <Text style={styles.startButtonText}>Start Game</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.gameArea} onPress={handleTap}>
          <Text style={styles.playerText}>Player {currentPlayer}</Text>
          {showWord ? <Text style={styles.wordText}>{word}</Text> : null}
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
    backgroundColor: '#fff',
    padding: 16,
  },
  label: {
    fontSize: RFValue(16),
    marginBottom: 8,
    fontWeight: 'bold',
  },
  picker: {
    width: RFValue(80),
    marginBottom: 16,
  },
  input: {
    width: RFValue(180),
    height: RFValue(40),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    fontSize: RFValue(16),
    backgroundColor: '#f9f9f9',
  },
  startButton: {
    backgroundColor: '#1fa4cd',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
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
    marginBottom: 16,
  },
  wordText: {
    fontSize: RFValue(32),
    color: '#1fa4cd',
    fontWeight: 'bold',
    marginBottom: 24,
  },
  tapText: {
    fontSize: RFValue(14),
    color: '#888',
    marginTop: 32,
  },
});

export default SpyGame;
