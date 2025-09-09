import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import themeSpyColors from '../../constants/themeSpyColors';
import { auth, db, ref, remove, update } from './firebase';
import { listenToRoom } from './room';

const RoomWaiting = () => {
  const { roomCode } = useLocalSearchParams();
  const router = useRouter();
  const code = useMemo(() => String(roomCode || ''), [roomCode]);
  const [room, setRoom] = useState(null);
  const [spiesCount, setSpiesCount] = useState(1);
  const uid = auth.currentUser?.uid;
  const navigatedRef = useRef(false);
  const leavingRef = useRef(false);

  useEffect(() => {
    if (!code) return;
    const unsub = listenToRoom(code, (data) => setRoom(data));
    return () => {
      try { unsub && unsub(); } catch {}
    };
  }, [code]);

  // If a non-host gets kicked (no longer in players), route them back to landing
  useEffect(() => {
    if (!room || !uid) return;
    const isHostUser = room?.host === uid;
    const inPlayers = !!room?.players?.[uid];
    if (!isHostUser && !inPlayers) {
      if (!leavingRef.current) {
        try {
          Alert.alert('Removed from room', 'You have been removed from the room.', [{ text: 'OK' }]);
        } catch {}
        router.replace('/spy_multiplayer/landing');
      }
    }
  }, [room, uid]);

  // Navigate everyone to the game screen once started
  useEffect(() => {
    if (!room || navigatedRef.current) return;
    if (room?.game?.started) {
      navigatedRef.current = true;
      router.replace({ pathname: '/spy_multiplayer/game', params: { roomCode: code } });
    }
  }, [room, code]);

  const onBack = async () => {
    // If we don't have room data yet, just leave the screen
    if (!room) {
      router.push('/spy_multiplayer/landing');
      return;
    }
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) {
      router.push('/spy_multiplayer/landing');
      return;
    }
    const isHostUser = room?.host === currentUid;
  if (isHostUser) {
      const count = Object.keys(room?.players || {}).length;
      if (count > 1) {
        Alert.alert(
          "You're the host",
          "You can't leave the lobby while others are in. You may change the set or transfer host.",
          [{ text: 'OK' }]
        );
        return;
      }
      // Host is alone: clean up the room and leave
      try {
        await remove(ref(db, `rooms/${code}`));
      } catch (e) {
        // Ignore cleanup failure; proceed with navigation
      }
      router.push('/spy_multiplayer/landing');
      return;
    }
  // Non-host: mark leaving to avoid duplicate alerts/navigation from listeners
  leavingRef.current = true;
    try {
      await remove(ref(db, `rooms/${code}/players/${currentUid}`));
    } catch (e) {
      // Non-blocking: still navigate away even if cleanup fails
      // console.warn('Failed to remove player from room:', e);
    }
    router.push('/spy_multiplayer/landing');
  };

  if (!room) {
    return (
      <View style={styles.container}>
      <TouchableOpacity style={styles.backIcon} onPress={onBack}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>
        <ActivityIndicator color={themeSpyColors.text} />
        <Text style={styles.subtle}>Waiting for room data…</Text>
      </View>
    );
  }

  const players = Object.entries(room.players || {});
  const isHost = uid && room?.host === uid;
  const playDisabled = !isHost || players.length <= spiesCount;

  const sets = {
    places: () => import('../../wordSets/places.json'),
    famous_people_us: () => import('../../wordSets/famous_people_us.json'),
    famous_people_tr: () => import('../../wordSets/famous_people_tr.json'),
    football_players_tr: () => import('../../wordSets/football_players_tr.json'),
    football_players_world: () => import('../../wordSets/football_players_world.json'),
    films_world: () => import('../../wordSets/films_world.json'),
  };

  const startGame = async () => {
    if (!isHost) return;
    const setKey = room?.selectedSetKey || room?.wordSet || room?.public?.selectedSetKey;
    try {
      // Load words
      let words = [];
      if (setKey && sets[setKey]) {
        const setData = await sets[setKey]();
        words = setData.words || setData.default?.words || [];
      }
      const randomWord = words.length
        ? words[Math.floor(Math.random() * words.length)]
        : (room?.wordSetTitle || 'Unknown');

      // Build roles
      const uids = players.map(([id]) => id);
      const shuffled = [...uids].sort(() => Math.random() - 0.5);
      const spies = new Set(shuffled.slice(0, Math.min(spiesCount, uids.length)));
      const roles = uids.reduce((acc, id) => {
        acc[id] = spies.has(id) ? 'spy' : 'civilian';
        return acc;
      }, {});

      await update(ref(db, `rooms/${code}`), {
        game: {
          started: true,
          spiesCount,
          word: String(randomWord),
          roles,
        },
      });
    } catch (e) {
      try { Alert.alert('Error', 'Failed to start game.'); } catch {}
    }
  };

  const kickPlayer = async (targetUid) => {
    if (!isHost || !targetUid) return;
    try {
      await remove(ref(db, `rooms/${code}/players/${targetUid}`));
    } catch (e) {
      // Optional: show a toast/alert; keeping silent for now
    }
  };

  const makeHost = async (targetUid) => {
    if (!isHost || !targetUid || targetUid === room?.host) return;
    try {
      await update(ref(db, `rooms/${code}`), { host: targetUid });
    } catch (e) {
      // Optional: surface error
    }
  };

  return (
    <View style={styles.container}>
  <TouchableOpacity style={styles.backIcon} onPress={onBack}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>Room {code}</Text>
      {(() => {
        const title = room?.wordSetTitle || room?.selectedSetTitle || room?.public?.selectedSetTitle;
        return title ? <Text style={styles.subtitle}>Set: {title}</Text> : null;
      })()}
      <Text style={styles.subtle}>{players.length} player(s)</Text>
  {isHost && (
        <TouchableOpacity
          style={styles.changeSetButton}
          onPress={() => router.push({ pathname: '/spy_multiplayer/spy_multiplayer_game_select', params: { roomCode: code } })}
        >
          <Text style={styles.changeSetText}>Change Set</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={players}
        keyExtractor={([uid]) => uid}
        renderItem={({ item }) => {
          const [playerUid, info] = item;
          const label = info?.nickname || playerUid;
          const canKick = isHost && playerUid !== room?.host;
          const canMakeHost = isHost && playerUid !== room?.host;
          return (
            <View style={styles.playerRow}>
              <Text style={styles.playerName} numberOfLines={1} ellipsizeMode="tail">{label}</Text>
              <View style={styles.actionButtons}>
                {canMakeHost && (
                  <TouchableOpacity style={styles.makeHostButton} onPress={() => makeHost(playerUid)}>
                    <Ionicons name="ribbon-outline" size={22} color="#f7c948" />
                  </TouchableOpacity>
                )}
                {canKick && (
                  <TouchableOpacity style={styles.kickButton} onPress={() => kickPlayer(playerUid)}>
                    <Ionicons name="remove-circle-outline" size={24} color="#ff6b6b" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        }}
        style={{ marginTop: RFValue(16), width: '80%' }}
      />

      {/* Bottom controls: Spies picker + Play button */}
  {isHost && (
  <View style={styles.bottomBar}>
        <View style={styles.spiesRow}>
          <Text style={styles.spiesLabel}>Spies</Text>
          <View style={styles.spiesChips}>
            {[1, 2, 3].map((n) => {
              const selected = spiesCount === n;
              return (
                <TouchableOpacity
                  key={n}
                  style={[styles.spyChip, selected && styles.spyChipSelected]}
                  onPress={() => setSpiesCount(n)}
                >
                  <Text style={[styles.spyChipText, selected && styles.spyChipTextSelected]}>{n}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <TouchableOpacity
          style={[styles.playButton, playDisabled && styles.playButtonDisabled]}
          onPress={startGame}
          disabled={playDisabled}
          accessibilityState={{ disabled: playDisabled }}
        >
          <Text style={styles.playButtonText}>Play</Text>
        </TouchableOpacity>
      </View>
      )}
      {!isHost && (
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.leaveButton} onPress={onBack}>
            <Text style={styles.leaveButtonText}>Leave Room</Text>
          </TouchableOpacity>
        </View>
      )}
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
    marginBottom: RFValue(8),
    marginTop: RFValue(20),
  },
  subtitle: {
    fontSize: RFValue(16),
    color: themeSpyColors.text,
    opacity: 0.9,
    marginBottom: RFValue(6),
  },
  subtle: {
    color: themeSpyColors.text,
    opacity: 0.8,
  },
  playerName: {
    flex: 1,
    color: themeSpyColors.text,
    backgroundColor: themeSpyColors.button,
    padding: RFValue(10),
    borderRadius: RFValue(8),
    marginVertical: RFValue(4),
    marginRight: RFValue(8),
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // gap is not supported on older RN; spacing handled via margins
    marginVertical: RFValue(4),
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  makeHostButton: {
    paddingHorizontal: RFValue(6),
    paddingVertical: RFValue(4),
    marginRight: RFValue(2),
  },
  kickButton: {
    paddingHorizontal: RFValue(6),
    paddingVertical: RFValue(4),
  },
  changeSetButton: {
    backgroundColor: themeSpyColors.createYourOwnSetButton || themeSpyColors.button,
    padding: RFValue(10),
    borderRadius: RFValue(8),
    marginTop: RFValue(10),
  },
  changeSetText: {
    color: themeSpyColors.text,
    fontWeight: 'bold',
  },
  backIcon: {
    position: 'absolute',
    top: RFValue(40),
    left: RFValue(20),
    zIndex: 10,
  },
  bottomBar: {
    position: 'absolute',
    bottom: RFValue(24),
    left: 0,
    right: 0,
    paddingHorizontal: RFValue(16),
    alignItems: 'center',
  },
  spiesRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: RFValue(12),
  },
  spiesLabel: {
    color: themeSpyColors.text,
    fontSize: RFValue(14),
    opacity: 0.9,
  },
  spiesChips: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spyChip: {
    backgroundColor: themeSpyColors.button,
    borderRadius: RFValue(8),
    paddingVertical: RFValue(6),
    paddingHorizontal: RFValue(10),
    marginLeft: RFValue(8),
  },
  spyChipSelected: {
    backgroundColor: themeSpyColors.createYourOwnSetButton || themeSpyColors.button,
  },
  spyChipText: {
    color: themeSpyColors.text,
    fontWeight: '600',
  },
  spyChipTextSelected: {
    color: themeSpyColors.text,
  },
  playButton: {
    width: '100%',
    backgroundColor: themeSpyColors.button,
    borderRadius: RFValue(10),
    paddingVertical: RFValue(12),
    alignItems: 'center',
  },
  playButtonDisabled: {
    backgroundColor: themeSpyColors.disabled || '#777',
    opacity: 0.6,
  },
  playButtonText: {
    color: themeSpyColors.text,
    fontWeight: 'bold',
    fontSize: RFValue(16),
  },
  leaveButton: {
    width: '100%',
    backgroundColor: themeSpyColors.button,
    borderRadius: RFValue(10),
    paddingVertical: RFValue(12),
    alignItems: 'center',
  },
  leaveButtonText: {
    color: themeSpyColors.text,
    fontWeight: 'bold',
    fontSize: RFValue(16),
  },
});

export default RoomWaiting;
