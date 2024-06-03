import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

export default function Map() {
    const initialRegion = {
        latitude: 51.9225, // Latitude of Rotterdam
        longitude: 4.47917, // Longitude of Rotterdam
        latitudeDelta: 0.0922, // Zoom level for latitude
        longitudeDelta: 0.0421, // Zoom level for longitude
    };

    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        const fetchMarkers = async () => {
            try {
                const response = await fetch('https://stud.hosted.hr.nl/1056617/data.json');
                const data = await response.json();
                const formattedMarkers = data.map(item => ({
                    latlng: {
                        latitude: item.latitude,
                        longitude: item.longitude
                    },
                    title: item.title,
                    description: item.description
                }));
                setMarkers(formattedMarkers);
            } catch (error) {
                console.error('Error fetching marker data:', error);
            }
        };

        fetchMarkers();
    }, []);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={initialRegion}
            >
                {markers.map((marker, index) => (
                    <Marker
                        key={index}
                        coordinate={marker.latlng}
                        title={marker.title}
                        description={marker.description}
                    />
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});
