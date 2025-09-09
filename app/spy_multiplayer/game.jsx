import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import themeSpyColors from '../../constants/themeSpyColors';
import { auth, db, onValue, ref, update } from './firebase';

const SpyMultiplayerGame = () => {
  const params = useLocalSearchParams();
  const roomCode = params.roomCode || '';
  const router = useRouter();
  const code = useMemo(() => String(roomCode || ''), [roomCode]);
  const uid = auth.currentUser?.uid;
  const [room, setRoom] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const finishedHandled = useRef(false);

  useEffect(() => {
    if (!code) return;
    const unsub = onValue(ref(db, `rooms/${code}`), (snap) => {
      const data = snap.val() || {};
      setRoom(data);
    });
    return () => {
      try { unsub && unsub(); } catch {}
    };
  }, [code]);

  const game = room?.game;
  const players = Object.entries(room?.players || {});
  const isHost = uid && room?.host === uid;
  const myReveal = !!game?.reveals?.[uid];
  const totalPlayers = players.length;
  const revealsCount = Object.values(game?.reveals || {}).filter(Boolean).length;

  // Host finalization: when all current players have revealed, finish game and broadcast spies
  useEffect(() => {
    if (!room || !game?.started || game?.finished || !isHost) return;
    const uids = players.map(([id]) => id);
    if (uids.length === 0) return;
    const allReady = uids.every((id) => game?.reveals?.[id]);
    if (allReady) {
      const spyUids = Object.entries(game?.roles || {})
        .filter(([, role]) => role === 'spy')
        .map(([id]) => id);
      const spyNames = spyUids.map((id) => room?.players?.[id]?.nickname || id);
      update(ref(db, `rooms/${code}/game`), {
        finished: true,
        started: false,
        revealedSpies: spyNames,
      }).catch(() => {});
    }
  }, [room, game, isHost, code, players]);

  // Everyone: when finished, show spies and return to lobby
  useEffect(() => {
    if (!game?.finished || finishedHandled.current) return;
    finishedHandled.current = true;
  const names = Array.isArray(game?.revealedSpies) ? game.revealedSpies : [];
  const list = names.length ? names.join(', ') : 'Spies';
  try { Alert.alert('Spies', list || ''); } catch {}
  if (params.wordsCustom) {
    router.replace({ pathname: '/spy_multiplayer/room_waiting', params: { roomCode: code, wordsCustom: params.wordsCustom } });
  } else {
    router.replace({ pathname: '/spy_multiplayer/room_waiting', params: { roomCode: code } });
  }
  }, [game?.finished]);

  if (!game?.started) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Waiting for game…</Text>
      </View>
    );
  }

  const role = game?.roles?.[uid];
  const isSpy = role === 'spy';

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backIcon} onPress={() => router.replace({ pathname: '/spy_multiplayer/room_waiting', params: { roomCode: code } })}>
        <Text style={styles.backText}>{'< Back'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.gameArea} onPress={() => setRevealed((v) => !v)}>
        {revealed ? (
          isSpy ? (
            <>
              <Text style={styles.spyText}>You are a spy</Text>
              <Text style={styles.tapText}>Tap to hide</Text>
            </>
          ) : (
            <>
              <Text style={styles.label}>Word</Text>
              <Text style={styles.word}>{game.word}</Text>
              <Text style={styles.tapText}>Tap to hide</Text>
            </>
          )
          
        ) : (
          <Text style={styles.tapText}>Tap to reveal</Text>
        )}
      </TouchableOpacity>

        {/* Reveal spies toggle */}
        <TouchableOpacity
          style={[styles.revealBtn, myReveal && styles.revealBtnActive]}
          onPress={() => update(ref(db, `rooms/${code}/game/reveals`), { [uid]: !myReveal }).catch(() => {})}
          disabled={game?.finished}
        >
          <Text style={styles.revealBtnText}>
            {myReveal ? `Waiting for other players ${revealsCount} / ${totalPlayers}` : 'Reveal Spies'}
          </Text>
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
  backIcon: {
    position: 'absolute',
    top: RFValue(40),
    left: RFValue(20),
  },
  backText: {
    color: themeSpyColors.text,
    fontSize: RFValue(16),
  },
  title: {
    fontSize: RFValue(28),
    color: themeSpyColors.text,
    fontWeight: 'bold',
    marginBottom: RFValue(16),
  },
  label: {
    fontSize: RFValue(16),
    color: themeSpyColors.text,
    opacity: 0.8,
  },
  word: {
    fontSize: RFValue(32),
    color: themeSpyColors.wordText,
    fontWeight: 'bold',
    marginTop: RFValue(8),
  },
  spyText: {
    fontSize: RFValue(28),
    color: themeSpyColors.spyText,
    fontWeight: 'bold',
  },
  text: {
    color: themeSpyColors.text,
  },
  gameArea: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapText: {
    fontSize: RFValue(16),
    color: themeSpyColors.tapText || themeSpyColors.text,
    opacity: 0.85,
    marginTop: RFValue(12),
  },
  revealBtn: {
    width: '90%',
    backgroundColor: themeSpyColors.button,
    borderRadius: RFValue(10),
    paddingVertical: RFValue(12),
    alignItems: 'center',
    marginBottom: RFValue(24),
  },
  revealBtnActive: {
    backgroundColor: themeSpyColors.playButton || '#4caf50',
  },
  revealBtnText: {
    color: themeSpyColors.text,
    fontWeight: 'bold',
    fontSize: RFValue(16),
  },
});

export default SpyMultiplayerGame;
