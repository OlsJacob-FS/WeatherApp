import React, { useState } from 'react'; // React hooks for state management
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'; // Core UI components
import { signInWithEmailAndPassword } from 'firebase/auth';
 // Firebase method for login
import { auth } from '../firebaseConfig'; // Your Firebase configuration


const LoginScreen = ({ navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if(!email || !password) {
            Alert.alert("Error, Please enter email and password");
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            Alert.alert("Login Successful, Welcome Back");
            navigation.replace("Home");
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
        <TouchableOpacity  onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.link}>Don't have an account? Register</Text>
        </TouchableOpacity>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      textAlign: 'center',
      paddingTop: 100,
      position: 'fixed',
      top: 0,
      padding: 20, 
      backgroundColor: '#2B3339', 
    },
    title: {
      fontSize: 24, 
      fontWeight: 'bold', 
      color: '#D3C6AA', 
      marginBottom: 20, 
      textAlign: 'center', 
    },
    input: {
      width: '100%', 
      height: 40, 
      padding: 10, 
      borderColor: '#4F5B66', 
      borderWidth: 1, 
      borderRadius: 8, 
      backgroundColor: '#3C474D', 
      color: '#D3C6AA', 
      marginBottom: 20, 
    },
    button: {
      backgroundColor: '#A7C080', 
      padding: 12, 
      borderRadius: 8, 
      alignItems: 'center',
      margin: 5,
    },
    buttonText: {
      color: '#2B3339', 
      fontSize: 16, 
      fontWeight: 'bold', 
    },
    link: {
      color: '#A7C080',
      textAlign: 'center',
      marginTop: 5,
    },
  
  });

  export default LoginScreen;