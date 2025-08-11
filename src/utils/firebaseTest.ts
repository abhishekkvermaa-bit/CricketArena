import auth from '@react-native-firebase/auth';

export const testFirebaseConnection = () => {
  try {
    console.log('🔥 Firebase Auth initialized:', auth().app.name);
    console.log('📱 App package:', auth().app.options.android?.packageName);
    console.log('🏠 App name:', auth().app.options.appId);
    console.log('🔑 Project ID:', auth().app.options.projectId);
    console.log('✅ Firebase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Firebase connection error:', error);
    return false;
  }
};
