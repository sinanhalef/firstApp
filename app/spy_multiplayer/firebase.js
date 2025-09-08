// Firebase config and initialization for multiplayer logic
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { child, get, getDatabase, onValue, push, ref, remove, set, update } from 'firebase/database';

// TODO: Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCIqiTB_7ZFfL2fsgS9hGuh6xCTcqYSH1c",
  authDomain: "partygames-10095.firebaseapp.com",
  projectId: "partygames-10095",
  // Recommended format for storage bucket is <project>.appspot.com
  storageBucket: "partygames-10095.appspot.com",
  messagingSenderId: "637203191905",
  appId: "1:637203191905:web:caf1406dcef46d07b03220",
  measurementId: "G-536X1JLQ0Y",
  databaseURL: "https://partygames-10095-default-rtdb.europe-west1.firebasedatabase.app",
};

// Use a named app to avoid conflicts if a default app is initialized elsewhere
const APP_NAME = 'spy-mp';
let app;
const existing = getApps().find(a => a.name === APP_NAME);
if (existing) {
  app = getApp(APP_NAME);
} else {
  app = initializeApp(firebaseConfig, APP_NAME);
}
const auth = getAuth(app);
// Explicitly pass the databaseURL to avoid any ambiguity
const db = getDatabase(app, firebaseConfig.databaseURL);

// Expose the configured database URL for REST fallbacks
const DB_URL = firebaseConfig.databaseURL;

export { app, auth, child, db, DB_URL, get, onValue, push, ref, remove, set, signInAnonymously, update };

