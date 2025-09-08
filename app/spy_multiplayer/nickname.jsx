import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import themeSpyColors from '../../constants/themeSpyColors';
import { auth, db, get, ref, update } from './firebase';

const Nickname = () => {
  const router = useRouter();
  const { roomCode } = useLocalSearchParams();
  const code = useMemo(() => String(roomCode || ''), [roomCode]);
  const [name, setName] = useState('');
  const canContinue = name.trim().length >= 2;

  const onContinue = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      // If not signed in for some reason, just go back
      return router.push('/spy_multiplayer/landing');
    }
    const playerRef = ref(db, `rooms/${code}/players/${uid}`);
    // Update player node with nickname
    await update(playerRef, { nickname: name.trim() });
    // Check if current user is the host of the room; if so, go to game select
    try {
      const roomSnap = await get(ref(db, `rooms/${code}`));
      const roomVal = roomSnap.val() || {};
      if (roomVal?.host === uid) {
        return router.push({ pathname: '/spy_multiplayer/spy_multiplayer_game_select', params: { roomCode: code } });
      }
    } catch {}
    // Default: go to waiting room
    router.push({ pathname: '/spy_multiplayer/room_waiting', params: { roomCode: code } });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>Choose a Nickname</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Your name"
        placeholderTextColor={themeSpyColors.selectedText}
        style={styles.input}
        maxLength={20}
      />
      <TouchableOpacity disabled={!canContinue} style={[styles.button, !canContinue && styles.buttonDisabled]} onPress={onContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
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
    marginBottom: RFValue(16),
  },
  input: {
    width: RFValue(240),
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(12),
    borderRadius: RFValue(8),
    backgroundColor: themeSpyColors.button,
    color: themeSpyColors.text,
    fontSize: RFValue(18),
    textAlign: 'center',
    marginBottom: RFValue(16),
  },
  button: {
    backgroundColor: themeSpyColors.playButton,
    padding: RFValue(14),
    borderRadius: RFValue(8),
    width: RFValue(220),
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: themeSpyColors.text,
    fontWeight: 'bold',
    fontSize: RFValue(18),
  },
  backIcon: {
    position: 'absolute',
    top: RFValue(40),
    left: RFValue(20),
    zIndex: 10,
  },
});

export default Nickname;
