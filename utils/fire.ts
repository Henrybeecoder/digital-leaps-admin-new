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

const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG || '');

const apps = getApps();

const app = !apps.length ? initializeApp(firebaseConfig) : apps[0];

const auth = getAuth(app);

const db = initializeFirestore(app, {
  localCache: persistentLocalCache(
    /*settings*/ { tabManager: persistentMultipleTabManager() }
  ),
});

// setPersistence(auth, inMemoryPersistence);

export {
  auth,
  db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
};
