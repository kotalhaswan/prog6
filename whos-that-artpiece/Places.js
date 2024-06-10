import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ThemeContext, ThemeProvider} from './ThemeContext';
import {useContext} from "react";

export const Places = () => {
    const [titles, setTitles] = useState([]);
    const { isDarkMode } = useContext(ThemeContext);

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                "Accept": "application/json",
            }
        };
        fetch('https://stud.hosted.hr.nl/1056617/data.json', options)
            .then(response => response.json())
            .then(data => {
                const titlesArray = data.map(item => item.title);
                setTitles(titlesArray);
            })
            .catch(error => console.error(error));
    }, []);

    return (
        <View style={[styles.container, isDarkMode && styles.darkContainer]}>
            {titles.map((title, index) => (
                <Text key={index} style={[styles.text, isDarkMode && styles.darkThemeText]}>Title: {title}</Text>
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

export default Places;
