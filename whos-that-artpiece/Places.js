import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

export const Places = () => {
    const [titles, setTitles] = useState([]);

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
        <View>
            {titles.map((title, index) => (
                <Text key={index}>Title: {title}</Text>
            ))}
        </View>
    );
};

export default Places;
