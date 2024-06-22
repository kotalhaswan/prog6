import * as React from 'react';
import { ThemeContext, ThemeProvider } from "./ThemeContext";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { useContext } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Places from "./Places";
import Map from "./Map";
import Settings from "./Settings";
import { Button, StyleSheet, Text, View } from "react-native";

const Stack = createNativeStackNavigator();
// buttons to travel to different pages
function HomeScreen({ navigation }) {
    const { isDarkMode } = useContext(ThemeContext);
    return (
        <View style={[styles.container, isDarkMode && styles.darkContainer]}>
            <Text style={[styles.text, isDarkMode && styles.darkThemeText]}>Who's that artpiece?!</Text>
            <Button
                title="Go to Places"
                onPress={() => navigation.navigate('Places')}
            />
            <Button
                title="Go to Map"
                onPress={() => navigation.navigate('Map')}
            />
            <Button
                title="Go to Settings"
                onPress={() => navigation.navigate('Settings')}
            />
        </View>
    );
}

export default function NavigationScreen() {
    const { isDarkMode } = useContext(ThemeContext);
    return (
        <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Places" component={Places} />
                <Stack.Screen name="Map" component={Map} />
                <Stack.Screen name="Settings" component={Settings} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
    },
    lightContainer: {
        backgroundColor: '#d0d0c0',
    },
    darkContainer: {
        backgroundColor: '#242c40',
    },
    lightThemeText: {
        color: '#242c40',
    },
    darkThemeText: {
        color: '#d0d0c0',
    },
});
