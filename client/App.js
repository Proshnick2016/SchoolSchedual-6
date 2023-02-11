import React from "react";
import Schedual from "./pages/Schedual";
import HomePage from "./pages/HomePage";
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { NavigationContainer } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomePage} options={{ title: "Вход" }} />
        <Stack.Screen name="Schedual" component={Schedual} options={{ title: "Расписание" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

