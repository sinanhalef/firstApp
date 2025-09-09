// Firebase config and initialization for multiplayer logic
import {
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL,
  FIREBASE_MEASUREMENT_ID,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
} from '@env';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { child, get, getDatabase, onValue, push, ref, remove, set, update } from 'firebase/database';

// Firebase config now loaded from environment variables
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
  databaseURL: FIREBASE_DATABASE_URL,
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

