import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const autoLogin = async () => {
  const email = import.meta.env.VITE_FIREBASE_AUTO_LOGIN_EMAIL;
  const password = import.meta.env.VITE_FIREBASE_AUTO_LOGIN_PASSWORD;

  if (!email || !password) {
    console.warn("Auto-login credentials not found in environment.");
    return null;
  }

  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log("Auto-login successful:", result.user.email);
    return result.user;
  } catch (error) {
    console.error("Auto-login failed:", error);
    return null;
  }
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  const serialized = JSON.stringify(errInfo);
  console.error('Firestore Error: ', serialized);
  throw new Error(serialized);
}

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Authentication Error:", error);
    throw error;
  }
};

// Connection Test
async function testConnection() {
  try {
    // We attempt to read a non-existent doc to trigger a connection check
    await getDocFromServer(doc(db, 'system', 'ping'));
    console.log("Firebase Connection: Healthy");
  } catch (error: any) {
    if (error.message?.includes('offline')) {
      console.error("Firebase is offline. Check configuration.");
    }
  }
}

testConnection();
