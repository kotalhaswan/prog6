// Places.js
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from './ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

export const Places = () => {
    const [titles, setTitles] = useState([]);
    const [favorites, setFavorites] = useState({});
    const { isDarkMode } = useContext(ThemeContext);
    const navigation = useNavigation();

    //fetches data from json
    useEffect(() => {
        const fetchData = async () => {
            const options = {
                method: 'GET',
                headers: {
                    "Accept": "application/json",
                }
            };
            try {
                const response = await fetch('https://stud.hosted.hr.nl/1056617/data.json', options);
                const data = await response.json();
                const titlesArray = data.map(item => item.title);
                setTitles(titlesArray);
            } catch (error) {
                console.error(error);
            }
        };
        // loads favorite locations
        const loadFavorites = async () => {
            try {
                const savedFavorites = await AsyncStorage.getItem('favorites');
                if (savedFavorites) {
                    setFavorites(JSON.parse(savedFavorites));
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
        loadFavorites();
    }, []);

    // save a location as your favorite with fingerprint authentication:
    const toggleFavorite = async (title) => {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (!hasHardware || !isEnrolled) {
            Alert.alert('Authentication Error', 'Fingerprint authentication is not available on this device.');
            return;
        }

        const authResult = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Authenticate to toggle favorite',
            fallbackLabel: 'Enter Passcode',
        });

        if (authResult.success) {
            const newFavorites = { ...favorites, [title]: !favorites[title] };
            setFavorites(newFavorites);
            try {
                await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
            } catch (error) {
                console.error(error);
            }
        } else {
            Alert.alert('Authentication Failed', 'Could not authenticate user.');
        }
    };

    return (
        <View style={[styles.container, isDarkMode && styles.darkContainer]}>
            {titles.map((title, index) => (
                <View key={index} style={styles.item}>
                    <Text style={[
                        styles.text,
                        isDarkMode && styles.darkThemeText,
                        favorites[title] && styles.favoriteText
                    ]}>
                        Title: {title}
                    </Text>
                    <Button
                        title={favorites[title] ? 'Unfavorite' : 'Favorite'}
                        onPress={() => toggleFavorite(title)}
                        color={favorites[title] ? 'green' : 'blue'}
                    />
                    <Button
                        title="View location"
                        onPress={() => navigation.navigate('Map', { title })}
                        color="orange"
                    />
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    text: {
        fontSize: 20,
        marginRight: 10,
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
    favoriteText: {
        color: 'green',
    },
});

export default Places;
