import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';

import { getApps, initializeApp } from 'firebase/app';

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  // setPersistence,
  // inMemoryPersistence,
} from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSENGER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

const apps = getApps();

const app = !apps.length ? initializeApp(firebaseConfig) : apps[0];

const auth = getAuth(app);

const db = initializeFirestore(app, {
  localCache: persistentLocalCache(
    /*settings*/ { tabManager: persistentMultipleTabManager() }
  ),
});

const storage = getStorage(app);

// setPersistence(auth, inMemoryPersistence);

export {
  auth,
  db,
  storage,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
};
