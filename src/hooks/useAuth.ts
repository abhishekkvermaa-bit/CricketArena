import { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { User, AuthState } from '../types/auth';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Configure Google Sign-In
    GoogleSignin.configure({
      webClientId: '767476034345-8g7hsg72ub9kd2m976c0icnvd16okd8c.apps.googleusercontent.com', // ← Replace with your actual Web Client ID
    });

    const subscriber = auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const user: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          isAnonymous: firebaseUser.isAnonymous,
          createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
        };

        console.log('✅ User signed in:', user.isAnonymous ? 'Guest' : user.email);

        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        console.log('👋 User signed out');
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    });

    return subscriber; // Cleanup subscription
  }, []);

  

  const signInAsGuest = async () => {
    try {
      console.log('👤 Starting Guest Sign-In...');
      setAuthState(prev => ({ ...prev, isLoading: true }));
      await auth().signInAnonymously();
      console.log('✅ Guest sign-in successful');
    } catch (error) {
      console.error('❌ Guest sign-in error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };
const signInWithGoogle = async () => {
  try {
    console.log('🔐 Starting Google Sign-In...');
    setAuthState(prev => ({ ...prev, isLoading: true }));

    // Check if device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    // Sign in and get user info
    const signInResult = await GoogleSignin.signIn();
    
    // Get the ID token - try different possible locations
    let idToken: string | null = null;
    
    if (signInResult.data?.idToken) {
      idToken = signInResult.data.idToken;
    } else if ((signInResult as any).idToken) {
      idToken = (signInResult as any).idToken;
    } else {
      // Try to get tokens separately
      const tokens = await GoogleSignin.getTokens();
      idToken = tokens.idToken;
    }

    if (!idToken) {
      throw new Error('Unable to get ID token from Google Sign-In');
    }

    console.log('✅ Got ID token');

    // Create Firebase credential and sign in
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    await auth().signInWithCredential(googleCredential);

    console.log('✅ Google Sign-In successful');
  } catch (error: any) {
    console.error('❌ Google Sign-In error:', error);
    setAuthState(prev => ({ ...prev, isLoading: false }));
    throw error;
  }
};

  const signOut = async () => {
    try {
      console.log('👋 Signing out...');
      await auth().signOut();
      if (!authState.user?.isAnonymous) {
        await GoogleSignin.revokeAccess();
      }
      console.log('✅ Sign out successful');
    } catch (error) {
      console.error('❌ Sign out error:', error);
      throw error;
    }
  };

  return {
    ...authState,
    signInWithGoogle,
    signInAsGuest,
    signOut,
  };
}
