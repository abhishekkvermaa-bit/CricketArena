import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { useSounds } from '../hooks/useSounds';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const { signInWithGoogle, signInAsGuest, isLoading } = useAuth();
  const { playButtonClick } = useSounds();

  const handleGoogleSignIn = async () => {
    try {
      playButtonClick();
      await signInWithGoogle();
      onLoginSuccess();
    } catch (error) {
      Alert.alert('Sign In Failed', 'Unable to sign in with Google. Please try again.');
    }
  };

  const handleGuestSignIn = async () => {
    try {
      playButtonClick();
      await signInAsGuest();
      onLoginSuccess();
    } catch (error) {
      Alert.alert('Sign In Failed', 'Unable to continue as guest. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Cricket Arena</Text>
          <Text style={styles.subtitle}>Sign in to save your progress and compete on leaderboards!</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.googleButton, isLoading && styles.disabledButton]} 
            onPress={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Text style={styles.googleButtonText}>
              {isLoading ? 'Signing In...' : '🔐 Sign In with Google'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.guestButton, isLoading && styles.disabledButton]} 
            onPress={handleGuestSignIn}
            disabled={isLoading}
          >
            <Text style={styles.guestButtonText}>
              🎮 Continue as Guest
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>With an account, you get:</Text>
          <Text style={styles.feature}>📊 Cloud-saved statistics</Text>
          <Text style={styles.feature}>🏆 Weekly leaderboards</Text>
          <Text style={styles.feature}>🎯 Achievement system</Text>
          <Text style={styles.feature}>📱 Cross-device sync</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C2D',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    maxWidth: '80%',
    lineHeight: 24,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  googleButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  googleButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  guestButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFD700',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  guestButtonText: {
    color: '#FFD700',
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  featuresContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  featuresTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
    textAlign: 'center',
  },
  feature: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default LoginScreen;
