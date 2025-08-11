import React, { useState } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, StatusBar, TextInput, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useSounds } from '../hooks/useSounds';
import { useAuth } from '../hooks/useAuth';
import { useUserStats } from '../hooks/useUserStats';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

type Props = NativeStackScreenProps<RootStackParamList, 'MainMenu'>;

function MainMenuScreen({ navigation }: Props) {
  const { playButtonClick } = useSounds();
  const { signOut, user } = useAuth();
  const { stats, isLoading } = useUserStats();
  const isPressed = useSharedValue(false);
  
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(isPressed.value ? 0.95 : 1) }],
    };
  });
  
  const navigateToGameSelection = (): void => {
    playButtonClick();
    navigation.navigate('GameSelection');
  };

  const handleHighScores = (): void => {
    playButtonClick();
    console.log('High Scores - Coming Soon!');
  };

  const handleSettings = (): void => {
    playButtonClick();
    navigation.navigate('Settings');
  };

  const handleStatistics = (): void => {
    playButtonClick();
    navigation.navigate('Statistics');
  };

  const handleSignOut = async (): Promise<void> => {
    try {
      playButtonClick();
      console.log('🔄 Signing out...');
      await signOut();
    } catch (error) {
      console.error('❌ Sign out error:', error);
    }
  };

  // Email/Password Login
  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      setIsLoginLoading(true);
      playButtonClick();
      
      try {
        await auth().signInWithEmailAndPassword(email, password);
        console.log('✅ Email sign-in successful');
        Alert.alert('Welcome!', 'Successfully signed in! Your progress is now saved to the cloud.');
        setEmail('');
        setPassword('');
      } catch (signInError: any) {
        if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/invalid-credential') {
          try {
            await auth().createUserWithEmailAndPassword(email, password);
            console.log('✅ Email account created and signed in');
            Alert.alert('Welcome!', 'Account created successfully! Your progress will now be saved to the cloud.');
            setEmail('');
            setPassword('');
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
      
      let errorMessage = 'Unable to sign in. Please try again.';
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use at least 6 characters.';
      }
      
      Alert.alert('Sign In Failed', errorMessage);
    } finally {
      setIsLoginLoading(false);
    }
  };

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      setIsLoginLoading(true);
      playButtonClick();
      
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      const signInResult = await GoogleSignin.signIn();
      let idToken = signInResult.data?.idToken;
      
      if (!idToken) {
        idToken = (signInResult as any).idToken;
      }
      
      if (!idToken) {
        const tokens = await GoogleSignin.getTokens();
        idToken = tokens.idToken;
      }
      
      if (!idToken) {
        throw new Error('No ID token found');
      }

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      
      console.log('✅ Google sign-in successful');
      Alert.alert('Welcome!', 'Successfully signed in with Google! Your progress is now saved to the cloud.');
    } catch (error: any) {
      console.error('❌ Google sign-in error:', error);
      if (error.code !== 'sign_in_cancelled') {
        Alert.alert('Sign In Failed', 'Unable to sign in with Google. Please try again.');
      }
    } finally {
      setIsLoginLoading(false);
    }
  };

  const gesture = Gesture.Tap()
    .onBegin(() => {
      'worklet';
      isPressed.value = true;
    })
    .onFinalize(() => {
      'worklet';
      isPressed.value = false;
    })
    .onEnd(() => {
      'worklet';
      runOnJS(navigateToGameSelection)();
    });

  // Render user info based on authentication status
  const renderUserInfo = () => {
    if (user?.isAnonymous) {
      return (
        <View style={styles.userInfo}>
          <View style={styles.userDetailsContainer}>
            <Text style={styles.userText}>👤 Guest User</Text>
            <Text style={styles.sessionText}>(Session-only stats)</Text>
          </View>
          <View style={styles.topIcons}>
            <TouchableOpacity onPress={handleStatistics} style={styles.iconButton}>
              <Text style={styles.iconText}>📊</Text>
              {stats && stats.totalGamesPlayed > 0 && (
                <View style={[styles.iconBadge, styles.guestBadge]}>
                  <Text style={styles.badgeText}>{stats.totalGamesPlayed}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSettings} style={styles.iconButton}>
              <Text style={styles.iconText}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.userInfo}>
          <View style={styles.userDetailsContainer}>
            <Text style={styles.userText}>
              👋 {user?.displayName || user?.email || 'Authenticated User'}
            </Text>
            <Text style={styles.permanentText}>☁️ Cloud-synced stats</Text>
          </View>
          <View style={styles.topIcons}>
            <TouchableOpacity onPress={handleStatistics} style={styles.iconButton}>
              <Text style={styles.iconText}>📊</Text>
              {stats && stats.totalGamesPlayed > 0 && (
                <View style={[styles.iconBadge, styles.permanentBadge]}>
                  <Text style={styles.badgeText}>{stats.totalGamesPlayed}</Text>
                </View>
              )}
              {stats && stats.currentWinStreak > 0 && (
                <View style={styles.streakBadge}>
                  <Text style={styles.streakText}>🔥{stats.currentWinStreak}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSettings} style={styles.iconButton}>
              <Text style={styles.iconText}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  // Render login section (only for guests)
  const renderLoginSection = () => {
    if (!user?.isAnonymous) return null;

    return (
      <View style={styles.loginSection}>
        <Text style={styles.loginTitle}>Login with:</Text>
        
        {/* Email/Password Section */}
        <View style={styles.emailLoginContainer}>
          <TextInput
            style={styles.loginInput}
            placeholder="Enter your email"
            placeholderTextColor="#888888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <TextInput
            style={styles.loginInput}
            placeholder="Password (min 6 characters)"
            placeholderTextColor="#888888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
          />
          <TouchableOpacity
            style={[styles.emailLoginButton, isLoginLoading && styles.disabledButton]}
            onPress={handleEmailLogin}
            disabled={isLoginLoading}
          >
            <Text style={styles.emailLoginButtonText}>
              {isLoginLoading ? 'Signing In...' : '📧 Sign In with Email'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* OR Separator */}
        <View style={styles.separator}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>OR</Text>
          <View style={styles.separatorLine} />
        </View>

        {/* Google Login */}
        <TouchableOpacity
          style={[styles.googleLoginButton, isLoginLoading && styles.disabledButton]}
          onPress={handleGoogleSignIn}
          disabled={isLoginLoading}
        >
          <Text style={styles.googleIcon}>🔍</Text>
          <Text style={styles.googleLoginText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Benefits Text */}
        <Text style={styles.benefitsText}>
          💾 Save your progress permanently • 📱 Sync across devices • 🏆 Unlock achievements
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0C0C2D" />
      
      {/* User info with top icons */}
      {renderUserInfo()}

      {/* Main title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Cricket Arena</Text>
        <Text style={styles.subtitle}>Master the cards, conquer the pitch!</Text>
      </View>

      {/* Main navigation buttons */}
      <View style={styles.buttonContainer}>
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.button, styles.playButton, animatedStyle]}>
            <Text style={styles.buttonText}>⚡ Play Game</Text>
          </Animated.View>
        </GestureDetector>
        
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleHighScores}>
          <Text style={styles.buttonText}>🏆 High Scores</Text>
        </TouchableOpacity>
        
        {/* Show Sign Out button for authenticated users, Settings button for guests */}
        {!user?.isAnonymous ? (
          <TouchableOpacity style={[styles.button, styles.signOutButton]} onPress={handleSignOut}>
            <Text style={styles.signOutButtonText}>🚪 Sign Out</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Login Section - Only shown for guest users */}
      {renderLoginSection()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C2D',
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF10',
  },
  userDetailsContainer: {
    flex: 1,
  },
  userText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 2,
  },
  sessionText: {
    color: '#FF9800',
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    fontStyle: 'italic',
  },
  permanentText: {
    color: '#4CAF50',
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
  },

  // Top Icons
  topIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    position: 'relative',
    padding: 10,
    backgroundColor: '#FFFFFF10',
    borderRadius: 10,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF20',
  },
  iconText: {
    fontSize: 20,
  },
  iconBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestBadge: {
    backgroundColor: '#FF9800',
  },
  permanentBadge: {
    backgroundColor: '#4CAF50',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
  },
  streakBadge: {
    position: 'absolute',
    top: -4,
    left: -8,
    backgroundColor: '#FF6B35',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  streakText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontFamily: 'Poppins-Bold',
  },

  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  title: {
    fontSize: 48,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginVertical: 6,
    width: '75%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  playButton: {
    backgroundColor: '#4CAF50',
    transform: [{ scale: 1.05 }],
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF20',
  },
  signOutButton: {
    backgroundColor: '#FF6B6B',
    marginTop: 8,
    width: '60%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  signOutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },

  // Login Section
loginSection: {
  paddingHorizontal: 20,
  paddingVertical: 20,
  backgroundColor: '#FFFFFF05',
  marginHorizontal: 20,
  marginBottom: 30, // ← Increased from 20 to 30 for better bottom spacing
  borderRadius: 15,
  borderWidth: 1,
  borderColor: '#FFFFFF10',
},
  loginTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  emailLoginContainer: {
    marginBottom: 20,
  },
  loginInput: {
    backgroundColor: '#FFFFFF10',
    borderWidth: 1,
    borderColor: '#FFFFFF20',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
    marginBottom: 12,
  },
  emailLoginButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#4285F4',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  emailLoginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  disabledButton: {
    opacity: 0.6,
  },

  // Separator
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#FFFFFF20',
  },
  separatorText: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginHorizontal: 15,
  },

  // Google Login
  googleLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DB4437',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#DB4437',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  googleIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  googleLoginText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  benefitsText: {
    color: '#CCCCCC',
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 16,
    opacity: 0.8,
  },
});

export default MainMenuScreen;
