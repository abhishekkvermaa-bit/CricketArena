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
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useSounds } from '../hooks/useSounds';

interface EnhancedLoginScreenProps {
  onLoginSuccess: () => void;
}

function EnhancedLoginScreen({ onLoginSuccess }: EnhancedLoginScreenProps) {
  const { playButtonClick } = useSounds();
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [confirmation, setConfirmation] = useState<any>(null);

  // Email/Password Authentication
  const handleEmailSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      setIsLoading(true);
      playButtonClick();
      
      try {
        await auth().signInWithEmailAndPassword(email, password);
        console.log('✅ Email sign-in successful');
        onLoginSuccess();
      } catch (signInError: any) {
        if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/invalid-credential') {
          try {
            await auth().createUserWithEmailAndPassword(email, password);
            console.log('✅ Email account created and signed in');
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
      Alert.alert('Sign In Failed', error.message || 'Unable to sign in with email');
    } finally {
      setIsLoading(false);
    }
  };

  // Phone Number/OTP Authentication
  const handlePhoneSignIn = async () => {
    if (!phone) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    try {
      setIsLoading(true);
      playButtonClick();

      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
      const confirmation = await auth().signInWithPhoneNumber(formattedPhone);
      setConfirmation(confirmation);
      setOtpSent(true);
      console.log('📱 OTP sent to:', formattedPhone);
      Alert.alert('OTP Sent', 'Please check your phone for the verification code');
    } catch (error: any) {
      console.error('❌ Phone authentication error:', error);
      Alert.alert('Error', 'Unable to send OTP. Please check your phone number and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async () => {
    if (!otp || !confirmation) {
      Alert.alert('Error', 'Please enter the OTP code');
      return;
    }

    try {
      setIsLoading(true);
      await confirmation.confirm(otp);
      console.log('✅ Phone sign-in successful');
      onLoginSuccess();
    } catch (error: any) {
      console.error('❌ OTP verification error:', error);
      Alert.alert('Verification Failed', 'Invalid OTP code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtpSent(false);
    setOtp('');
    setConfirmation(null);
    await handlePhoneSignIn();
  };

  // ✅ FIXED: Google Sign-In with proper idToken handling
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      playButtonClick();
      
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Get user info and token - FIXED idToken access
      const signInResult = await GoogleSignin.signIn();
      
      // Try the new style of google-sign in result, from v13+ of that module
      let idToken = signInResult.data?.idToken;
      
      if (!idToken) {
        // If you are using older versions of google-signin, try old style result
        idToken = (signInResult as any).idToken;
      }
      
      if (!idToken) {
        // Try to get tokens separately
        const tokens = await GoogleSignin.getTokens();
        idToken = tokens.idToken;
      }
      
      if (!idToken) {
        throw new Error('No ID token found');
      }

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      
      console.log('✅ Google sign-in successful');
      onLoginSuccess();
    } catch (error: any) {
      console.error('❌ Google sign-in error:', error);
      if (error.code === 'sign_in_cancelled') {
        console.log('User cancelled Google sign-in');
      } else {
        Alert.alert('Sign In Failed', 'Unable to sign in with Google. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    playButtonClick();
    Alert.alert(
      'Coming Soon', 
      'Facebook sign-in will be available in the next update! 📘\n\nFor now, please use Email, Phone, or Google sign-in.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleTwitterSignIn = async () => {
    playButtonClick();
    Alert.alert(
      'Coming Soon', 
      'Twitter sign-in will be available in the next update! 🐦\n\nFor now, please use Email, Phone, or Google sign-in.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleGooglePlayGamesSignIn = async () => {
    playButtonClick();
    Alert.alert(
      'Coming Soon', 
      'Google Play Games sign-in will be available in the next update! 🎮\n\nFor now, please use Email, Phone, or Google sign-in.',
      [{ text: 'OK', style: 'default' }]
    );
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

          {/* Primary Authentication Methods */}
          <View style={styles.primaryAuthContainer}>
            <Text style={styles.sectionTitle}>Sign In Using</Text>
            
            {/* Tab Selector */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'email' && styles.activeTab]}
                onPress={() => {
                  playButtonClick();
                  setActiveTab('email');
                }}
              >
                <Text style={[styles.tabText, activeTab === 'email' && styles.activeTabText]}>
                  📧 Email
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.tab, activeTab === 'phone' && styles.activeTab]}
                onPress={() => {
                  playButtonClick();
                  setActiveTab('phone');
                }}
              >
                <Text style={[styles.tabText, activeTab === 'phone' && styles.activeTabText]}>
                  📱 Phone Number
                </Text>
              </TouchableOpacity>
            </View>

            {/* Email Authentication */}
            {activeTab === 'email' && (
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
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password (min 6 characters)"
                  placeholderTextColor="#888888"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="password"
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
            )}

            {/* Phone Authentication */}
            {activeTab === 'phone' && (
              <View style={styles.authForm}>
                {!otpSent ? (
                  <>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter phone number (+919876543210)"
                      placeholderTextColor="#888888"
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                      autoComplete="tel"
                    />
                    <TouchableOpacity
                      style={[styles.primaryButton, isLoading && styles.disabledButton]}
                      onPress={handlePhoneSignIn}
                      disabled={isLoading}
                    >
                      <Text style={styles.primaryButtonText}>
                        {isLoading ? 'Sending OTP...' : 'Send OTP'}
                      </Text>
                    </TouchableOpacity>
                    <Text style={styles.helpText}>
                      We'll send a verification code to your phone
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.otpSentText}>
                      📱 OTP sent to {phone}
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter 6-digit OTP"
                      placeholderTextColor="#888888"
                      value={otp}
                      onChangeText={setOtp}
                      keyboardType="numeric"
                      maxLength={6}
                      autoComplete="sms-otp"
                    />
                    <TouchableOpacity
                      style={[styles.primaryButton, isLoading && styles.disabledButton]}
                      onPress={handleOtpVerify}
                      disabled={isLoading}
                    >
                      <Text style={styles.primaryButtonText}>
                        {isLoading ? 'Verifying...' : 'Verify OTP'}
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.resendButton}
                      onPress={handleResendOtp}
                      disabled={isLoading}
                    >
                      <Text style={styles.resendButtonText}>Resend OTP</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}

            {/* OR Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Media Authentication */}
            <View style={styles.socialContainer}>
              <View style={styles.socialRow}>
                <TouchableOpacity
                  style={[styles.socialButton, styles.googleButton]}
                  onPress={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <Text style={styles.socialIcon}>🔍</Text>
                  <Text style={styles.socialButtonText}>Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.socialButton, styles.facebookButton]}
                  onPress={handleFacebookSignIn}
                  disabled={isLoading}
                >
                  <Text style={styles.socialIcon}>📘</Text>
                  <Text style={styles.socialButtonText}>Facebook</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.socialRow}>
                <TouchableOpacity
                  style={[styles.socialButton, styles.twitterButton]}
                  onPress={handleTwitterSignIn}
                  disabled={isLoading}
                >
                  <Text style={styles.socialIcon}>🐦</Text>
                  <Text style={styles.socialButtonText}>Twitter</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.socialButton, styles.playGamesButton]}
                  onPress={handleGooglePlayGamesSignIn}
                  disabled={isLoading}
                >
                  <Text style={styles.socialIcon}>🎮</Text>
                  <Text style={styles.socialButtonText}>Play Games</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Features Section */}
            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>With an account, you get:</Text>
              <Text style={styles.feature}>☁️ Cloud-saved statistics across all devices</Text>
              <Text style={styles.feature}>🏆 Permanent achievement progress</Text>
              <Text style={styles.feature}>📊 Detailed performance analytics</Text>
              <Text style={styles.feature}>⚡ Cross-device game synchronization</Text>
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

// ... (Keep all the existing styles exactly the same)
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
  primaryAuthContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    color: '#FFD700',
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 25,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF10',
    borderRadius: 12,
    padding: 4,
    marginBottom: 25,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  tabText: {
    fontSize: 15,
    color: '#CCCCCC',
    fontFamily: 'Poppins-SemiBold',
  },
  activeTabText: {
    color: '#0C0C2D',
  },
  authForm: {
    marginBottom: 25,
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
  otpSentText: {
    color: '#4CAF50',
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: '#4CAF5015',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  resendButton: {
    alignItems: 'center',
    marginTop: 15,
    paddingVertical: 8,
  },
  resendButtonText: {
    color: '#FFD700',
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#FFFFFF30',
  },
  dividerText: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginHorizontal: 20,
  },
  socialContainer: {
    marginBottom: 30,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  googleButton: {
    backgroundColor: '#DB4437',
  },
  facebookButton: {
    backgroundColor: '#4267B2',
  },
  twitterButton: {
    backgroundColor: '#1DA1F2',
  },
  playGamesButton: {
    backgroundColor: '#34A853',
  },
  socialIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  socialButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
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
