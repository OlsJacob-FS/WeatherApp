import Constants from 'expo-constants';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: Constants.expoConfig.extra.fbApiKey,
  authDomain: Constants.expoConfig.extra.fbAuthDomain,
  projectId: Constants.expoConfig.extra.fbProjectId,
  storageBucket: Constants.expoConfig.extra.fbStorageBucket,
  messagingSenderId: Constants.expoConfig.extra.fbMessagingSenderId,
  appId: Constants.expoConfig.extra.fbAppId,
  measurementId: Constants.expoConfig.extra.fbMeasurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);