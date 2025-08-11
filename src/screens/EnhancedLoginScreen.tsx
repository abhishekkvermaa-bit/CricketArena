import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Alert,
  StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import { useSounds } from '../hooks/useSounds';

interface EnhancedLoginScreenProps {
  onLoginSuccess: () => void;
}

function EnhancedLoginScreen({ onLoginSuccess }: EnhancedLoginScreenProps) {
  const { playButtonClick } = useSounds();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Email/Password Authentication
  const handleEmailSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      setIsLoading(true);
      playButtonClick();
      
      try {
        // Try signing in first
        await auth().signInWithEmailAndPassword(email, password);
        console.log('✅ Email sign-in successful');
        onLoginSuccess();
      } catch (signInError: any) {
        // If user doesn't exist, create account
        if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/invalid-credential') {
          try {
            await auth().createUserWithEmailAndPassword(email, password);
            console.log('✅ Email account created and signed in');
            Alert.alert('Welcome!', 'Account created successfully! Your progress will now be saved to the cloud.');
            onLoginSuccess();
          } catch (createError: any) {
            console.error('❌ Account creation error:', createError);
            Alert.alert('Account Creation Failed', createError.message || 'Unable to create account');
          }
        } else {
          throw signInError;
        }
      }
    } catch (error: any) {
      console.error('❌ Email authentication error:', error);
      
      // User-friendly error messages
      let errorMessage = 'Unable to sign in. Please try again.';
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists. Try signing in instead.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use at least 6 characters.';
      }
      
      Alert.alert('Sign In Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Guest Mode
  const handleGuestSignIn = async () => {
    try {
      setIsLoading(true);
      playButtonClick();
      await auth().signInAnonymously();
      console.log('✅ Guest sign-in successful (session-only stats)');
      onLoginSuccess();
    } catch (error) {
      console.error('❌ Guest sign-in error:', error);
      Alert.alert('Error', 'Unable to continue as guest. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0C0C2D" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Cricket Arena</Text>
            <Text style={styles.subtitle}>Sign in to save your progress and compete across devices!</Text>
          </View>

          {/* Email Authentication Form */}
          <View style={styles.authContainer}>
            <Text style={styles.sectionTitle}>Sign In with Email</Text>
            
            <View style={styles.authForm}>
              <TextInput
                style={styles.input}
                placeholder="Enter your email address"
                placeholderTextColor="#888888"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your password (min 6 characters)"
                placeholderTextColor="#888888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={[styles.primaryButton, isLoading && styles.disabledButton]}
                onPress={handleEmailSignIn}
                disabled={isLoading}
              >
                <Text style={styles.primaryButtonText}>
                  {isLoading ? 'Signing In...' : 'Continue with Email'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.helpText}>
                New users will automatically get an account created
              </Text>
            </View>

            {/* Features Section */}
            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>With an account, you get:</Text>
              <Text style={styles.feature}>☁️ Cloud-saved statistics across all devices</Text>
              <Text style={styles.feature}>🏆 Permanent achievement progress</Text>
              <Text style={styles.feature}>📊 Detailed performance analytics</Text>
              <Text style={styles.feature}>⚡ Cross-device game synchronization</Text>
            </View>

            {/* Coming Soon Social Options */}
            <View style={styles.comingSoonContainer}>
              <Text style={styles.comingSoonTitle}>🚀 More Sign-In Options Coming Soon</Text>
              <View style={styles.comingSoonOptions}>
                <View style={styles.comingSoonOption}>
                  <Text style={styles.comingSoonIcon}>📘</Text>
                  <Text style={styles.comingSoonText}>Facebook</Text>
                </View>
                <View style={styles.comingSoonOption}>
                  <Text style={styles.comingSoonIcon}>🐦</Text>
                  <Text style={styles.comingSoonText}>Twitter</Text>
                </View>
                <View style={styles.comingSoonOption}>
                  <Text style={styles.comingSoonIcon}>🔍</Text>
                  <Text style={styles.comingSoonText}>Google</Text>
                </View>
              </View>
            </View>

            {/* Guest Mode */}
            <View style={styles.guestContainer}>
              <TouchableOpacity
                style={[styles.guestButton, isLoading && styles.disabledButton]}
                onPress={handleGuestSignIn}
                disabled={isLoading}
              >
                <Text style={styles.guestButtonText}>
                  Continue as Guest (session-only, stats reset on app restart)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C2D',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 42,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    maxWidth: '90%',
    lineHeight: 22,
  },
  authContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    color: '#FFD700',
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 25,
  },
  authForm: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#FFFFFF10',
    borderWidth: 1,
    borderColor: '#FFFFFF20',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#4285F4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  helpText: {
    color: '#888888',
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: 8,
  },
  featuresContainer: {
    backgroundColor: '#FFFFFF08',
    borderRadius: 15,
    padding: 25,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#FFD70020',
  },
  featuresTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  feature: {
    color: '#CCCCCC',
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  comingSoonContainer: {
    backgroundColor: '#FFFFFF05',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#FFFFFF10',
    borderStyle: 'dashed',
  },
  comingSoonTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  comingSoonOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  comingSoonOption: {
    alignItems: 'center',
    opacity: 0.7,
  },
  comingSoonIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  comingSoonText: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  guestContainer: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  guestButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  guestButtonText: {
    color: '#777777',
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default EnhancedLoginScreen;
