import React, { useState } from 'react'; // React and hooks for managing state
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'; // UI components from React Native
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Firebase method to create users
import { auth } from "../firebaseConfig"; // Firebase authentication instance



const SignUpScreen = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = () => {
        if(!email || !password){
          Alert.alert("Error: Please enter ina valid email and password");
           return;
         }

         createUserWithEmailAndPassword(auth, email, password)
        .then((userCrendential) => {
    
            Alert.alert("Account Created Successfully", "Welcome to Mossy Skies!");
            console.log("User Registered", userCrendential.user);
            navigation.navigate("Login");
        }).catch((error) => {
            Alert.alert("Sign-Up Failed", error.message);
            
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>

            <TextInput
                style={styles.input}
                placeholder='Email'
                value={email}
                onChangeText={setEmail}
                keyboardType='email-address'
                autoCapitalize='none'
                placeholderTextColor="#4f5b66"
            />

            <TextInput
                style={styles.input}
                placeholder='Password'
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#4f5b66"
            />

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.link}>Already have an account? Login</Text>
            </TouchableOpacity>
        </View>
    )

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#2B3339',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#D3C6AA',
        textAlign: 'center',
        marginBottom: 20,
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
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#2B3339',
        fontSize: 16,
        fontWeight: 'bold',
    },
    link: {
        color: '#A7C080',
        textAlign: 'center',
    }
});

export default SignUpScreen;
