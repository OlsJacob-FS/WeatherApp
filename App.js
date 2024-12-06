import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
{
  /*Import pages*/
}
import MainScreen from "./screens/MainScreen";
import HourlyForecastScreen from "./screens/HourlyForecastScreen";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";

const Stack = createStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        //User is logged in
        setIsLoggedIn(true);
      } else {
        //User is logged out
        setIsLoggedIn(false);
      }
    });

    return unsubscribe;
  }, []);

  if (isLoggedIn === null) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          gestureEnabled: true,
          gestureDirection: "horizontal",
          initialRouteName: isLoggedIn ? "Home" : "Login",
        }}
      >
        {/* {isLoggedIn ? ( */}
        {/* <React.Fragment> */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerTitle: "Login",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        />

        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{
            headerTitle: "Sign Up",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        />
        <Stack.Screen
          name="Home"
          component={MainScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="HourlyForecast"
          component={HourlyForecastScreen}
          options={{
            title: "Hourly Forecast",
            headerTitleStyle: { fontWeight: "bold" },
            cardStyleInterpolator:
              CardStyleInterpolators.forFadeFromBottomAndroid,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
