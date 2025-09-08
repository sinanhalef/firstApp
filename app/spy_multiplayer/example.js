// Example usage of the multiplayer logic (for testing or integration)
import { signInAnon, createRoom, joinRoom, listenToRoom } from './room';

// Usage example (call these from your React components)
export async function startMultiplayerFlow() {
  // 1. Sign in anonymously
  const user = await signInAnon();
  const userId = user.uid;

  // 2. Create a room
  const roomCode = await createRoom(userId);
  console.log('Room created with code:', roomCode);

  // 3. Join a room (can be used for joining as well)
  // const joined = await joinRoom(roomCode, userId);
  // console.log('Joined room:', joined);

  // 4. Listen for room updates
  const unsubscribe = listenToRoom(roomCode, (roomData) => {
    console.log('Room data updated:', roomData);
  });

  // Call unsubscribe() to stop listening
}
