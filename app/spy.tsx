import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const SpyGame = () => {
  const [playerCount, setPlayerCount] = useState(3);
  const [word, setWord] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [showWord, setShowWord] = useState(true);
  const [started, setStarted] = useState(false);

  const handleTap = () => {
    if (!started) return;
    if (showWord) {
      setShowWord(false);
    } else {
      if (currentPlayer < playerCount) {
        setCurrentPlayer(currentPlayer + 1);
        setShowWord(true);
      } else {
        setCurrentPlayer(1);
        setShowWord(true);
        setStarted(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      {!started ? (
        <>
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
          <Text style={styles.label}>Type in a word:</Text>
          <TextInput
            style={styles.input}
            value={word}
            onChangeText={setWord}
            placeholder="Enter word"
          />
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => setStarted(true)}
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
    width: RFValue(120),
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
