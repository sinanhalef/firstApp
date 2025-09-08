import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import themeSpyColors from '../../constants/themeSpyColors';
import { joinRoom, signInAnon } from './room';

const JoinLobby = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const normalized = useMemo(() => (code || '').replace(/\D/g, '').slice(0, 6), [code]);
  const canJoin = normalized.length === 6 && !loading;

  const onJoin = async () => {
    setError('');
    setLoading(true);
    try {
      const user = await signInAnon();
      const ok = await joinRoom(normalized, user.uid);
      if (!ok) {
        setError('Room not found. Check the code and try again.');
        return;
      }
  router.push({ pathname: '/spy_multiplayer/nickname', params: { roomCode: normalized } });
    } catch (e) {
      setError(String(e?.message || 'Failed to join room.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backIcon} onPress={() => router.push('/spy_multiplayer/landing')}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>Enter Room Code</Text>
      <TextInput
        value={normalized}
        onChangeText={setCode}
        placeholder="123456"
        placeholderTextColor={themeSpyColors.selectedText}
        keyboardType="number-pad"
        maxLength={6}
        style={styles.input}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity style={[styles.button, !canJoin && styles.buttonDisabled]} onPress={onJoin} disabled={!canJoin}>
        {loading ? (
          <ActivityIndicator color={themeSpyColors.text} />
        ) : (
          <Text style={styles.buttonText}>Join</Text>
        )}
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
    width: RFValue(200),
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(12),
    borderRadius: RFValue(8),
    backgroundColor: themeSpyColors.button,
    color: themeSpyColors.text,
    fontSize: RFValue(20),
    textAlign: 'center',
    letterSpacing: 6,
    marginBottom: RFValue(12),
  },
  error: {
    color: 'red',
    marginBottom: RFValue(12),
  },
  button: {
    backgroundColor: themeSpyColors.playButton,
    padding: RFValue(14),
    borderRadius: RFValue(8),
    width: RFValue(200),
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

export default JoinLobby;
