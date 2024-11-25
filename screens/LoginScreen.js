import React, { useState } from 'react'; // React hooks for state management
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'; // Core UI components
import { signInWithEmailAndPassword } from 'firebase/auth';
 // Firebase method for login
import { auth } from '../firebaseConfig'; // Your Firebase configuration


const LoginScreen = ({ navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if(!email){
            Alert.alert("Email is required");
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            Alert.alert("Login Successful, Welcome Back");
        })
        .catch((error) => {
            Alert.alert("Login Failed", error.message);
        });
    };


return (
    <View style={styles.container}>
        {/* Login Screen */}
        <Text style={styles.title}>Login</Text>

        {/*email input*/}
        <TextInput
            style={styles.input}
            placeholder='Email'
            value={email}
            onChangeText={setEmail}
            keyboardType='email-address'
            autoCapitalize='none'
            placeholderTextColor="#4f5b66"
        />

    {/*password input*/}
        <TextInput
            style={styles.input}
            placeholder='Password'
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            plazeholderTextColor="#4f5b66"
        />

        {/*login button*/}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/*navigate to register screen*/}
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.text}>Don't have an account? Register</Text>
        </TouchableOpacity>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1, // Fill the screen
      justifyContent: 'center', // Center vertically
      padding: 20, // Add padding for spacing
      backgroundColor: '#2B3339', // Everforest dark background
    },
    title: {
      fontSize: 24, // Large text for the title
      fontWeight: 'bold', // Make the title bold
      color: '#D3C6AA', // Everforest beige text
      marginBottom: 20, // Spacing below the title
      textAlign: 'center', // Center align the text
    },
    input: {
      width: '100%', // Full width input
      height: 40, // Fixed height
      padding: 10, // Internal padding
      borderColor: '#4F5B66', // Gray border
      borderWidth: 1, // Thin border
      borderRadius: 8, // Rounded corners
      backgroundColor: '#3C474D', // Slightly lighter background
      color: '#D3C6AA', // Text color
      marginBottom: 20, // Spacing between inputs
    },
    button: {
      backgroundColor: '#A7C080', // Everforest green
      padding: 12, // Padding inside the button
      borderRadius: 8, // Rounded corners
      alignItems: 'center', // Center-align text
    },
    buttonText: {
      color: '#2B3339', // Contrast text color
      fontSize: 16, // Text size
      fontWeight: 'bold', // Bold text
    },
    link: {
      color: '#E69875', // Everforest muted orange
      textAlign: 'center', // Center-align text
      marginTop: 10, // Space above the link
    },
  });

  export default LoginScreen;