// Logic for creating and joining rooms using Firebase Realtime Database and anonymous auth
import {
  auth,
  db,
  get,
  onValue,
  ref,
  set,
  signInAnonymously
} from './firebase';

// Prevent hanging when database is unreachable/misconfigured
const withTimeout = (promise, ms, message) => {
  let t;
  const timeout = new Promise((_, reject) => {
    t = setTimeout(() => reject(new Error(message || `Timeout after ${ms}ms`)), ms);
  });
  return Promise.race([
    promise.finally(() => clearTimeout(t)),
    timeout,
  ]);
};

// Sign in anonymously, returns user object
export async function signInAnon() {
  const result = await signInAnonymously(auth);
  return result.user;
}

// Create a new room, returns room code
export async function createRoom(userId) {
  // Generate a 6-digit numeric code and ensure no collision
  const genCode = () => String(Math.floor(100000 + Math.random() * 900000));
  let attempts = 0;
  while (attempts < 5) {
    const roomCode = genCode();
    const roomRef = ref(db, `rooms/${roomCode}`);
    const existing = await withTimeout(get(roomRef), 6000, 'Database read timed out');
    if (!existing.exists()) {
      await withTimeout(set(roomRef, {
        host: userId,
        players: {
          [userId]: { joinedAt: Date.now() },
        },
        createdAt: Date.now(),
        started: false,
      }), 8000, 'Database write timed out');
      return roomCode;
    }
    attempts += 1;
  }
  throw new Error('Could not allocate room code');
}

// Join an existing room, returns true if successful
export async function joinRoom(roomCode, userId) {
  const roomRef = ref(db, `rooms/${roomCode}`);
  const snapshot = await withTimeout(get(roomRef), 6000, 'Database read timed out');
  if (!snapshot.exists()) {
    return false;
  }
  // Add player to room
  const playerRef = ref(db, `rooms/${roomCode}/players/${userId}`);
  await withTimeout(set(playerRef, { joinedAt: Date.now() }), 8000, 'Database write timed out');
  return true;
}

// Listen for room updates (players joining, game starting, etc.)
export function listenToRoom(roomCode, callback) {
  const roomRef = ref(db, `rooms/${roomCode}`);
  return onValue(roomRef, (snapshot) => {
    callback(snapshot.val());
  });
}
