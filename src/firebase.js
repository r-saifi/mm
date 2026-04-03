// Firebase config loaded from .env — copy .env.example → .env and fill in your values.
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const {
  VITE_FIREBASE_API_KEY: apiKey,
  VITE_FIREBASE_AUTH_DOMAIN: authDomain,
  VITE_FIREBASE_PROJECT_ID: projectId,
  VITE_FIREBASE_MESSAGING_SENDER_ID: messagingSenderId,
  VITE_FIREBASE_APP_ID: appId,
} = import.meta.env;

// Guard: don't initialise with placeholder / missing values.
// This prevents the broken iframe error when .env isn't filled in yet.
const isConfigured =
  apiKey && !apiKey.startsWith('YOUR_') &&
  authDomain && !authDomain.startsWith('YOUR_') &&
  projectId && !projectId.startsWith('YOUR_');

export const firebaseReady = isConfigured;

let app, auth, db;

if (isConfigured) {
  const firebaseConfig = { apiKey, authDomain, projectId, messagingSenderId, appId };
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db   = getFirestore(app);
} else {
  console.warn(
    '[MM Design] Firebase is not configured.\n' +
    'Open your .env file and replace the YOUR_* placeholders with your real Firebase project values.\n' +
    'Then restart the dev server (npm run dev).'
  );
}

export { auth, db };
export default app;
