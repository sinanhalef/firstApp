import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import themeSpyColors from '../../constants/themeSpyColors';
// Use the room helpers from the app-local spy_multiplayer folder (avoids wrong config imports)
import { createRoom, signInAnon } from './room';

const HostLobby = () => {
  const [loading, setLoading] = useState(true);
  const [roomCode, setRoomCode] = useState(null);
  const [error, setError] = useState(null);
  const [errorDetail, setErrorDetail] = useState('');
  const router = useRouter();

  const setupRoom = async () => {
      try {
        const user = await signInAnon();
        console.log('Anon user signed in:', user?.uid);
        const code = await createRoom(user.uid);
        console.log('Room created with code:', code);
        setRoomCode(code);
      } catch (e) {
        console.error('Failed to create room:', e);
        setError('Failed to create room.');
        setErrorDetail(String(e?.message || e));
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    setupRoom();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={themeSpyColors.text} />
        <Text style={styles.infoText}>Creating your room...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        {!!errorDetail && <Text style={styles.errorDetail}>{errorDetail}</Text>}
        <TouchableOpacity
          style={[styles.button, { marginTop: RFValue(24) }]}
          onPress={() => {
            setError(null);
            setErrorDetail('');
            setLoading(true);
            setupRoom();
          }}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backIcon} onPress={() => router.push('/spy_multiplayer/landing')}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>Room Created!</Text>
      <Text style={styles.roomCode}>{roomCode}</Text>
      <Text style={styles.infoText}>Share this code with your friends to join.</Text>
  <TouchableOpacity style={styles.button} onPress={() => router.push({ pathname: '/spy_multiplayer/nickname', params: { roomCode } })}>
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
    marginBottom: RFValue(24),
  },
  roomCode: {
    fontSize: RFValue(36),
    color: themeSpyColors.playButton,
    fontWeight: 'bold',
    marginBottom: RFValue(16),
    letterSpacing: 4,
  },
  infoText: {
    color: themeSpyColors.text,
    fontSize: RFValue(16),
    marginBottom: RFValue(24),
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: RFValue(16),
    marginBottom: RFValue(24),
    textAlign: 'center',
  },
  errorDetail: {
    color: themeSpyColors.text,
    opacity: 0.8,
    fontSize: RFValue(12),
    marginBottom: RFValue(12),
    textAlign: 'center',
  },
  button: {
    backgroundColor: themeSpyColors.button,
    padding: RFValue(16),
    borderRadius: RFValue(8),
    marginTop: RFValue(20),
    width: RFValue(180),
    alignItems: 'center',
  },
  buttonText: {
    color: themeSpyColors.text,
    fontSize: RFValue(18),
    fontWeight: 'bold',
  },
  backIcon: {
    position: 'absolute',
    top: RFValue(40),
    left: RFValue(20),
    zIndex: 10,
  },
});

export default HostLobby;
