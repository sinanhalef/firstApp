import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import themeSpyColors from '../../constants/themeSpyColors';

const SpyMultiplayerLanding = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backIcon} onPress={() => router.push('/my_games')}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>Spy Multiplayer</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/spy_multiplayer/host_lobby')}
      >
        <Text style={styles.buttonText}>Host a Game</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/spy_multiplayer/join_lobby')}
      >
        <Text style={styles.buttonText}>Join a Game</Text>
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
    fontSize: RFValue(28),
    color: themeSpyColors.text,
    fontWeight: 'bold',
    marginBottom: RFValue(40),
  },
  button: {
    backgroundColor: themeSpyColors.button,
    padding: RFValue(16),
    borderRadius: RFValue(8),
    marginBottom: RFValue(20),
    width: RFValue(220),
    alignItems: 'center',
  },
  buttonText: {
    color: themeSpyColors.text,
    fontSize: RFValue(20),
    fontWeight: 'bold',
  },
  backIcon: {
    position: 'absolute',
    top: RFValue(40),
    left: RFValue(20),
    zIndex: 10,
  },
});

export default SpyMultiplayerLanding;
